import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { User } from 'src/users/entities/users.entity';

@Injectable()
export class UsersInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      map((data) => {
        if (data && Array.isArray(data)) {
          return data.map((user: User) => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { password, createdAt, updatedAt, ...res } = user;
            return res;
          });
        } else if (data) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { password, createdAt, updatedAt, ...res } = data as User;
          return res;
        }
      }),
    );
  }
}
