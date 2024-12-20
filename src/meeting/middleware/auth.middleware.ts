import { HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

export interface AuthenticatedRequest extends Request {
  userId?: string;
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
    const userId = req.header('x-user-id');
    if (!userId) {
      res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: 'Authentication required' });
      return;
    }
    req.userId = userId;
    next();
  }
}
