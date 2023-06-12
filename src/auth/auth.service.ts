import { Injectable, NotFoundException } from '@nestjs/common';
import { UserAuthDataDto } from './user-auth-data.dto';
import { UsersService } from '../users/users.service';
import { AuthProviderEnum } from '../users/auth-provider.enum';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayloadDto } from './jwt-payload.dto';
import { AdminService } from '../admin/admin.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private adminService: AdminService,
  ) {}

  async logInUser(authData: UserAuthDataDto, provider: AuthProviderEnum) {
    const user = await this.usersService.createOrUpdateUser(authData, provider);
    // This is not what is actually used for protecting admin routes, just for UI.
    // admin-jwt-strategy checks the DB every time
    const isAdmin = await this.adminService.isUserAnAdmin(user.id);
    if (user.deletedAt) {
      throw new NotFoundException();
    }
    const payload = {
      username: user.username,
      userId: user.id,
      isAdmin,
    } as JwtPayloadDto;
    return {
      access_token: this.jwtService.sign(payload, {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: '14d',
      }),
    };
  }
}
