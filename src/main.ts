import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import * as cookieParser from 'cookie-parser';
import * as passport from 'passport';
import * as session from 'express-session';
import { config } from 'dotenv';
import { ValidationPipe } from '@nestjs/common';

const PORT = process.env.PORT || 3001;

config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: process.env.ORIGINAL_URL,
    credentials: true,
    exposedHeaders: ['x-user-role', 'theme'],
  });
  app.setGlobalPrefix('/api/v1');
  app.use(
    session({
      name: 'user_session',
      secret: process.env.SESSION_SECRET_KEY || '',
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 1000 * 60 * 10, // 10 minutes
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
      },
    }),
  );
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  app.use(cookieParser());
  app.use(helmet());
  app.use(passport.initialize());
  app.use(passport.session());
  await app.listen(PORT, () => {
    console.log(`Running in MODE: ${process.env.NODE_ENV} on PORT: ${PORT}`);
  });
}
bootstrap();
