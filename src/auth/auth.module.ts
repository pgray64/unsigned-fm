import { Module } from '@nestjs/common';
import { CsrfController } from './csrf.controller';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { GoogleStrategy } from './google.strategy';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { JwtAuthGuard } from './jwt-auth.guard';
import { JwtStrategy } from './jwt.strategy';
import { AdminJwtStrategy } from './admin-jwt.strategy';
import { AdminJwtAuthGuard } from './admin-jwt-auth.guard';
import { OptionalJwtAuthGuard } from './optional-jwt-auth.guard';

@Module({
  imports: [UsersModule],
  controllers: [CsrfController, AuthController],
  providers: [
    AuthService,
    GoogleStrategy,
    JwtService,
    JwtStrategy,
    JwtAuthGuard,
    AdminJwtStrategy,
    AdminJwtAuthGuard,
    OptionalJwtAuthGuard,
  ],
})
export class AuthModule {}
