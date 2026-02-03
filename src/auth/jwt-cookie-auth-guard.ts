import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Injectable()
export class JwtCookieAuthGuard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest<Request>();

    // 1) Si ya viene Authorization header (Bearer token del login normal), lo usa directo
    // 2) Si no viene header, busca en la cookie (flujo Google/Passport)
    if (!req.headers.authorization) {
      const token = req.cookies?.['jwt'];
      if (token) {
        req.headers.authorization = `Bearer ${token}`;
      }
    }

    return req;
  }
}
