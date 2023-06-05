import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request, Response } from 'express';
import { UsersService } from './users.service';
import { JwtPayloadDto } from '../auth/jwt-payload.dto';

@Controller('internal/users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('session')
  async getSession(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    return { isLoggedIn: true, user: request.user };
  }
  @Get('profile')
  async getProfile(@Req() request: Request) {
    const userJwt = request.user as JwtPayloadDto;
    const user = await this.usersService.findOneById(userJwt.userId);
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
    };
  }
}
