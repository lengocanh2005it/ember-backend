export const initCookies = (
  response: any,
  user: any,
  role: string,
  method: string,
  refreshToken?: string,
) => {
  response.cookie('role', role, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 1000 * 60 * 60 * 24 * 7,
  });

  response.cookie('isLoggedIn', 'true', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 1000 * 60 * 15,
  });

  response.cookie('theme', user.theme, {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 1000 * 60 * 60 * 24 * 7,
  });

  method !== 'local'
    ? response.cookie('refreshToken', user.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 1000 * 60 * 15,
      })
    : response.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 1000 * 60 * 15,
      });

  method !== 'local'
    ? response.cookie('accessToken', user.accessToken, {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 1000 * 60 * 2,
      })
    : '';
};
