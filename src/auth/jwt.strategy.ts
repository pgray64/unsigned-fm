import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { JwtPayloadDto } from './jwt-payload.dto';
import { ConfigService } from '@nestjs/config';
import authConstants from './auth.constants';
import { AdminService } from '../admin/admin.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private adminService: AdminService,
  ) {
    super({
      jwtFromRequest: cookieExtractor,
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
    });
  }

  async validate(payload: JwtPayloadDto) {
    let isAdmin = payload.isAdmin;
    if (isAdmin) {
      // So that admin privilege removal takes effect immediately.
      // Doesn't matter too much since admin routes are protected via admin-jwt-strategy
      // and that always checks the DB
      isAdmin = await this.adminService.isUserAnAdmin(payload.userId);
    }
    return {
      userId: payload.userId,
      username: payload.username,
      isAdmin,
    } as JwtPayloadDto;
  }
}
function cookieExtractor(req: any): string {
  return req?.cookies[authConstants.authCookieName]?.access_token;
}