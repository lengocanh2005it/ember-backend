export interface User {
  id: string;
  username: string;
  googleId: string | null;
  facebookId: string | null;
  roles: string[];
  iat: number;
  exp: number;
}
