import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtPayloadDto } from './jwt-payload.dto';
import { ConfigService } from '@nestjs/config';
import authConstants from './auth.constants';
import { AdminService } from '../admin/admin.service';

@Injectable()
export class AdminJwtStrategy extends PassportStrategy(Strategy, 'admin-jwt') {
  constructor(
    private configService: ConfigService,
    private adminService: AdminService,
  ) {
    super({
      jwtFromRequest: cookieExtractor,
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: JwtPayloadDto) {
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
function cookieExtractor(req: any): string {
  return req?.cookies[authConstants.authCookieName]?.access_token;
}
