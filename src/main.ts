import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { CsrfMiddleware } from './csrf.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn'],
  });
  app.use(cookieParser());
  app.use(CsrfMiddleware);
  await app.listen(3000);
}
bootstrap();
