import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { UserAuthDataDto } from './user-auth-data.dto';
import { AuthProviderEnum } from '../users/auth-provider.enum';
import { Response } from 'express';
import authConstants from './auth.constants';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('internal/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {
    /* Client visiting this URL redirects them to google sign-in page */
  }
  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(
    @Req() req,
    @Res({ passthrough: true }) response: Response,
  ) {
    /* Google sign-in successful, need to provide session token and redirect */
    const jwt = await this.authService.logInUser(
      req.user as UserAuthDataDto,
      AuthProviderEnum.Google,
    );
    response.cookie(authConstants.authCookieName, jwt, { httpOnly: true });
    response.redirect('/');
  }

  @Post('log-out')
  async logOut(@Res({ passthrough: true }) response: Response) {
    response.clearCookie(authConstants.authCookieName);
  }
}
