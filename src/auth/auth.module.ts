import { Module } from '@nestjs/common';
import { CsrfController } from './csrf.controller';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { GoogleStrategy } from './google.strategy';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [CsrfController, AuthController],
  providers: [AuthService, GoogleStrategy, JwtService],
})
export class AuthModule {}
