import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { config } from 'dotenv';
import { Profile, Strategy } from 'passport-google-oauth20';
import { AuthService } from 'src/auth/auth.service';

config();

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly authService: AuthService) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_REDIRECT_URI!,
      scope: ['profile', 'email'],
      accessType: 'offline',
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    const payload = await this.authService.validateUserGoogle({
      email: profile.emails[0].value,
      displayName: profile.displayName,
      googleId: profile.id,
    });

    return {
      ...payload.user,
      accessToken: payload.accessToken,
      refreshToken: payload.refreshToken,
    };
  }
}
