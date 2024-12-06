import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { User } from 'src/users/entities/users.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private readonly usersService: UsersService) {
    super();
  }

  serializeUser(user: User, done: (err: Error | null, user?: any) => void) {
    done(null, user.id);
  }

  async deserializeUser(
    payload: any,
    done: (err: Error | null, user?: any) => void,
  ) {
    const user = await this.usersService.findOne(payload);
    return user ? done(null, user) : done(null, null);
  }
}
