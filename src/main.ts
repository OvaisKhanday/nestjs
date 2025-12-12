import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'reflect-metadata';
import { ConsoleLogger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    rawBody: true,
    logger: new ConsoleLogger({
      colors: true,
      timestamp: true,
    }),
  });
  await app.listen(process.env.PORT ?? 5000);
}
bootstrap();
