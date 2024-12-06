import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { config } from 'dotenv';
import { Profile, Strategy } from 'passport-facebook';
import { AuthService } from 'src/auth/auth.service';

config();

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(private readonly authService: AuthService) {
    super({
      clientID: process.env.FACEBOOK_APP_ID!,
      clientSecret: process.env.FACEBOOK_APP_SECRET!,
      callbackURL: process.env.FACEBOOK_REDIRECT_URI!,
      profileFields: ['id', 'emails', 'name'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    const { familyName, middleName, givenName } = profile.name;

    const payload = await this.authService.validateUserFacebook({
      facebookId: profile.id,
      email:
        profile?.emails?.map((email) => email.value).join(',') ??
        'user123@gmail.com',
      displayName:
        familyName?.concat(' ' + middleName)?.concat(' ' + givenName) ?? '',
    });

    return {
      ...payload.user,
      accessToken: payload.accessToken,
      refreshToken: payload.refreshToken,
    };
  }
}
