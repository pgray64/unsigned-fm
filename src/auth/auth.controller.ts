import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { UserAuthDataDto } from './user-auth-data.dto';
import { AuthProviderEnum } from '../users/auth-provider.enum';
import { Request, Response } from 'express';
import authConstants from './auth.constants';

@Controller('internal/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req: Request) {
    /* Client visiting this URL redirects them to google sign-in page */
  }
  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(
    @Req() req: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    /* Google sign-in successful, need to provide session token and redirect */
    const jwt = await this.authService.logInUser(
      req.user as UserAuthDataDto,
      AuthProviderEnum.Google,
    );
    if (!jwt) {
      response.redirect('/account-error');
    }
    // Need http-only for front-end requests
    response.cookie(authConstants.authCookieName, jwt.access_token, {
      httpOnly: false,
    });
    response.redirect('/');
  }
}
