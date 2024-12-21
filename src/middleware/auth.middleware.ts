import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

export interface AuthenticatedRequest extends Request {
  userId?: string;
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
    const userId = req.header('x-user-id');
    if (!userId) throw new UnauthorizedException('AUTHENTICATION_REQUIRED');

    req.userId = userId;
    next();
  }
}
