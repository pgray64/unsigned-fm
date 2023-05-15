import { Module } from '@nestjs/common';
import { CsrfController } from './csrf/csrf.controller';

@Module({
  controllers: [CsrfController],
})
export class AuthenticationModule {}
