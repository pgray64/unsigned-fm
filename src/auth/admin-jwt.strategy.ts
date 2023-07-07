import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtPayloadDto } from './jwt-payload.dto';
import { ConfigService } from '@nestjs/config';
import authConstants from './auth.constants';
import { AdminService } from '../admin/admin.service';
import { Request } from 'express';

@Injectable()
export class AdminJwtStrategy extends PassportStrategy(Strategy, 'admin-jwt') {
  constructor(
    private configService: ConfigService,
    private adminService: AdminService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
    });
  }

  async validate(payload: JwtPayloadDto) {
    // Important enough to hit the DB each request
    const isAdmin = await this.adminService.isUserAnAdmin(payload.userId);
    if (!isAdmin) {
      throw new UnauthorizedException();
    }
    return {
      userId: payload.userId,
      username: payload.username,
    } as JwtPayloadDto;
  }
}
