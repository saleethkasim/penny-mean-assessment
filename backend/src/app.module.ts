import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://saleeth:Qwerty@saleeth.xuidial.mongodb.net/pennyDB?retryWrites=true&w=majority&appName=Saleeth'),
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
