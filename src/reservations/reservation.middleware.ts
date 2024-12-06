import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class ReservationMiddleware implements NestMiddleware {
  use(req: any, res: any, next: (error?: Error | any) => void) {
    return next();
  }
}
