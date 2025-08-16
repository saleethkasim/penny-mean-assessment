import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable validation for DTOs
  app.useGlobalPipes(new ValidationPipe());

  // Enable CORS for your Angular frontend
  app.enableCors({
    origin: 'http://localhost:4200', // Angular app URL
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  });

  await app.listen(3000);
}
bootstrap();
