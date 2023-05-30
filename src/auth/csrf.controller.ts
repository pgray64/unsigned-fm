import { Controller, Get, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import * as Crypto from 'crypto';
import authConstants from './auth.constants';

@Controller('internal/csrf')
export class CsrfController {
  @Get('csrf')
  GetCsrfToken(@Res({ passthrough: true }) response: Response) {
    const token = Crypto.randomBytes(64).toString('hex');
    response.cookie(authConstants.csrfCookieName, token); // can't set httpOnly as client CSRF protection needs to be able to read it
  }
}
