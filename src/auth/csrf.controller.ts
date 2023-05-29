import { Controller, Get, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import * as Crypto from 'crypto';

const cookieName = 'csrf_token';

@Controller('internal/csrf')
export class CsrfController {
  @Get()
  GetCsrfToken(@Res({ passthrough: true }) response: Response) {
    const token = Crypto.randomBytes(64).toString('hex');
    response.cookie(cookieName, token);
  }
}
