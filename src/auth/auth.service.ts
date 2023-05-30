import { Injectable, NotFoundException } from '@nestjs/common';
import { UserAuthDataDto } from './user-auth-data.dto';
import { UsersService } from '../users/users.service';
import { AuthProviderEnum } from '../users/auth-provider.enum';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async logInUser(authData: UserAuthDataDto, provider: AuthProviderEnum) {
    const user = await this.usersService.createOrUpdateUser(authData, provider);
    if (user.deletedAt) {
      throw new NotFoundException();
    }
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload, {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: '24h',
      }),
    };
  }
}
