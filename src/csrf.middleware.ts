import { UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

const cookieName = 'csrf_token';
const headerName = 'X-CSRF-TOKEN';

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
  const cookieValue = req.cookies[cookieName];
  const headerValue = req.header(headerName);

  // careful to not allow when they both match but are unset
  if (headerValue?.length > 1 && cookieValue === headerValue) {
    next();
  } else {
    throw new UnauthorizedException('Invalid CSRF token');
  }
}
