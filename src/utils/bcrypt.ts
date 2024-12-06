import * as bcrypt from 'bcrypt';

export const encodePassword = (password: string) => {
  const SALT = bcrypt.genSaltSync();
  return bcrypt.hashSync(password, SALT);
};
