import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Response } from 'express';

@Controller('internal/users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  @Post('session')
  @UseGuards(JwtAuthGuard)
  async getSession(
    @Req() request,
    @Res({ passthrough: true }) response: Response,
  ) {
    return { isLoggedIn: true, user: request.user };
  }
}
