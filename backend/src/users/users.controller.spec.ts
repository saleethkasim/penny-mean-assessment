import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.schema';

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            create: jest.fn().mockImplementation((dto: CreateUserDto) => ({
              _id: '1',
              ...dto,
            })),
            findAll: jest.fn().mockResolvedValue([
              { _id: '1', name: 'Test', email: 'test@test.com', password: '123456' },
            ]),
          },
        },
      ],
    }).compile();

    usersController = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(usersController).toBeDefined();
  });

  it('should create a user', async () => {
    const dto: CreateUserDto = { name: 'John', email: 'john@test.com', password: '123456' };
    const result = await usersController.create(dto);
    expect(result).toEqual({ _id: '1', ...dto });
  });

  it('should return an array of users', async () => {
    const result = await usersController.findAll();
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Test');
  });
});
