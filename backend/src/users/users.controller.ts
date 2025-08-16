import { Controller, Get, Post, Body, HttpException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.schema';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  // Signup
  @Post('signup')
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  // Login
  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    const user = await this.usersService.findOneByEmail(body.email);
    if (!user) throw new HttpException('Invalid email or password', 401);

    const isPasswordValid = await bcrypt.compare(body.password, user.password);
    if (!isPasswordValid) throw new HttpException('Invalid email or password', 401);

    const userId = (user as any)._id;
    const payload = { email: user.email, sub: userId };

    const token = this.jwtService.sign(payload, {
      expiresIn: '8h',
    });

    return { message: 'Login successful', token, user };
  }

  // Get all users
  @Get()
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  // Forgot password
  @Post('forgot-password')
  async forgotPassword(@Body('email') email: string) {
    const user = await this.usersService.findOneByEmail(email);
    if (!user) throw new HttpException('Email not found', 404);

    // JWT valid for 15 minutes
    const payload = { email: user.email };
    const token = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET || 'YOUR_SECRET_KEY',
      expiresIn: '15m',
    });

    const resetLink = `http://localhost:4200/reset-password?token=${token}`;
    console.log(`Password reset link: ${resetLink}`);

    return { message: 'Password reset link sent (check console)' };
  }

  // Reset password
  @Post('reset-password')
  async resetPassword(@Body('token') token: string, @Body('newPassword') newPassword: string) {
    try {
      const decoded: any = this.jwtService.verify(token);

      const email = decoded.email;
      const user = await this.usersService.findOneByEmail(email);
      if (!user) throw new HttpException('User not found', 404);

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await this.usersService.updatePassword(email, hashedPassword);

      return { message: 'Password has been reset successfully!' };
    } catch (err) {
      console.error('Reset password error:', err.message);
      throw new HttpException('Invalid or expired token', 400);
    }
  }
}
