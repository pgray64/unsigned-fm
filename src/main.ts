import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ShutdownSignal } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

function wwwRedirect(req: Request, res: Response, next: NextFunction) {
  if (req.headers.host.slice(0, 4) === 'www.') {
    const newHost = req.headers.host.slice(4);
    return res.redirect(301, req.protocol + '://' + newHost + req.originalUrl);
  }
  next();
}
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn'],
  });

  app.use(wwwRedirect);
  app.use(cookieParser());
  app.enableShutdownHooks([ShutdownSignal.SIGINT]);
  await app.listen(3000);
}
bootstrap();
