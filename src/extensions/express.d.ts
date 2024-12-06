import { User } from 'src/users/user.model';

declare global {
  namespace Express {
    interface Request {
      user?: User;
      refreshToken?: string;
      accessToken?: string;
    }
  }
}
