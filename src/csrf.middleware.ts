import { UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import authConstants from './auth/auth.constants';

const pathsToSkipCsrfCheck = ['/internal/auth/google/redirect'] as string[];

export function CsrfMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (req.method === 'GET' || pathsToSkipCsrfCheck.indexOf(req.path) >= 0) {
    next();
    return;
  }
  // Check csrf token
  const cookieValue = req.cookies[authConstants.csrfCookieName];
  const headerValue = req.header(authConstants.csrfHeaderName);

  // careful to not allow when they both match but are unset
  if (headerValue?.length > 1 && cookieValue === headerValue) {
    next();
  } else {
    throw new UnauthorizedException('csrf_token', 'Invalid CSRF token');
  }
}
