import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SkipThrottle } from '@nestjs/throttler';
import { config } from 'dotenv';
import { Request, Response } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { FacebookAuthGuard } from 'src/auth/guards/facebook.guard';
import { GoogleAuthGuard } from 'src/auth/guards/google.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { LocalAuthGuard } from 'src/auth/guards/local.guard';
import { RoleAuthGuard } from 'src/auth/guards/role.guard';
import { initCookies } from 'src/auth/utils/initCookies';
import { EmailsService } from 'src/emails/emails.service';
import { Roles } from 'src/roles/role.decorator';
import { Role } from 'src/roles/role.enum';
import { UsersService } from 'src/users/users.service';
import { encodePassword } from 'src/utils/bcrypt';
import { generateVerificationCode } from 'src/utils/utils';
import {
  OrderPaymentPayload,
  ReservationPaymentPayload,
  UserSessionPayload,
} from 'src/utils/types/auth.type';
import { Theme } from 'src/utils/types/theme.type';

config();

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly emailsService: EmailsService,
    private readonly jwtService: JwtService,
  ) {}

  @Get('role')
  @SkipThrottle()
  async handleAuthRole(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    if (req.cookies && req.cookies['role']) {
      res.setHeader('x-user-role', req.cookies['role']);
    }
    if (req.cookies && req.cookies['theme']) {
      if (req.cookies['theme'] === 'dark') {
        res.setHeader('theme', 'dark');
      } else {
        res.setHeader('theme', 'light');
      }
    }
    return res.sendStatus(200);
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(@Req() req: any, @Res() res: Response): Promise<void> {
    const { userId, refreshToken, accessToken } =
      req.user as UserSessionPayload;

    if (!refreshToken || !accessToken)
      throw new UnauthorizedException('Unauthenticated.');

    req.session.user = {
      userId,
      accessToken,
      refreshToken,
    };

    const user = await this.usersService.findOne(userId);

    if (user.username === process.env.ADMIN_NAME!) {
      initCookies(res, user, 'admin', 'local', refreshToken);
    } else {
      initCookies(res, user, 'user', 'local', refreshToken);
    }

    res.json({
      statusCode: 201,
      message: 'Logged in successfully!',
      data: { accessToken: accessToken },
    });
  }

  @Post('logout')
  logout(@Res() res: Response) {
    res.cookie('isLoggedIn', '', { httpOnly: true, secure: true, maxAge: 0 });
    res.cookie('refreshToken', '', { httpOnly: true, secure: true, maxAge: 0 });
    res.cookie('user_session', '', { httpOnly: true, secure: true, maxAge: 0 });
    res.cookie('role', '', { httpOnly: true, secure: true, maxAge: 0 });
    res.cookie('theme', '', { httpOnly: true, secure: false, maxAge: 0 });
    res.cookie('accessToken', '', {
      httpOnly: false,
      secure: false,
      maxAge: 0,
    });
    return res.json({
      statusCode: 200,
      message: 'Logged out successfully!',
    });
  }

  @Post('refresh')
  async handleRefreshToken(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    const refreshToken: string = req.cookies.refreshToken;

    if (refreshToken) {
      const accessToken: string =
        await this.authService.refreshToken(refreshToken);

      res.json({
        statusCode: 201,
        message: 'Refresh token successfully!',
        data: { accessToken },
      });
    } else {
      throw new UnauthorizedException();
    }
  }

  @SkipThrottle()
  @Post('theme')
  async handleSwitchTheme(
    @Res() res: Response,
    @Body() themePayload: Theme,
    @Req() request: any,
  ) {
    if (!request.session.user || !request.session.user.userId) {
      throw new UnauthorizedException('User not authenticated');
    }

    const userId: string = request.session.user.userId;

    const { theme } = themePayload;

    if (theme === 'light') {
      res.cookie('theme', 'light', {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 1000 * 60 * 60 * 24 * 7,
      });
    } else {
      res.cookie('theme', 'dark', {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 1000 * 60 * 60 * 24 * 7,
      });
    }

    await this.usersService.updateThemeOfUser(userId, theme);

    res.json({ statusCode: 201, message: 'Updated theme successfully!' });
  }

  @Get('profile')
  @SkipThrottle()
  @UseGuards(JwtAuthGuard, RoleAuthGuard)
  @Roles(Role.ADMIN, Role.USER)
  async getProfile(@Req() request: any): Promise<any> {
    if (!request.session.user || !request.session.user.userId) {
      throw new UnauthorizedException('User not authenticated.');
    }

    const userId: string = request.session.user.userId;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, createdAt, updatedAt, ...res } =
      await this.usersService.findOne(userId);

    return res;
  }

  @Get('google/login')
  @UseGuards(GoogleAuthGuard)
  async handleGoogleLogin() {
    return { msg: 'Google authentication!' };
  }

  @Get('google/redirect')
  @UseGuards(GoogleAuthGuard)
  handleGoogleRedirect(@Req() req: any, @Res() res: Response) {
    const user = req.user;

    if (user && user.accessToken) {
      req.session.user = { userId: user.id };

      initCookies(res, user, 'user', 'google');

      return res.redirect(process.env.REDIRECT_URL_HOMEPAGE!);
    }
    return res.redirect(process.env.REDIRECT_URL_LOGINPAGE!);
  }

  @Get('facebook/login')
  @UseGuards(FacebookAuthGuard)
  handleFacebookLogin() {
    return { msg: 'Facebook authentication!' };
  }

  @Get('facebook/redirect')
  @UseGuards(FacebookAuthGuard)
  handleFacebookRedirect(@Req() req: any, @Res() res: Response) {
    const user = req.user;

    if (user && user.accessToken) {
      req.session.user = { userId: user.id };

      initCookies(res, user, 'user', 'facebook');

      return res.redirect(process.env.REDIRECT_URL_HOMEPAGE!);
    }
    return res.redirect(process.env.REDIRECT_URL_LOGINPAGE!);
  }

  @Post('order/payment/credit-card')
  @UseGuards(JwtAuthGuard, RoleAuthGuard)
  @Roles(Role.USER, Role.ADMIN, Role.MANAGER)
  handlePaymentOrderByCreditCard(
    @Body() payload: OrderPaymentPayload,
  ): Promise<any> {
    const { orderId, userId, totalPrice } = payload;

    return this.authService.handlePaymentOrderByCreditCard(
      totalPrice,
      orderId,
      userId,
    );
  }

  @Post('reservation/payment/credit-card')
  @UseGuards(JwtAuthGuard, RoleAuthGuard)
  @Roles(Role.ADMIN, Role.USER, Role.MANAGER)
  async handlePaymentReservationByCreditCard(
    @Body() payload: ReservationPaymentPayload,
  ): Promise<any> {
    const { reservationId, userId, totalPrice, totalPriceInput } = payload;

    await this.authService.handlePaymentReservationByCreditCart(
      reservationId,
      userId,
      totalPriceInput,
      totalPrice,
    );

    return await this.usersService.findReservationById(userId);
  }

  @Post('request/reset-password')
  async handleRequestResetPassword(
    @Body('email') email: string,
  ): Promise<void> {
    const token = await this.authService.generateResetToken(email);
    await this.emailsService.sendResetEmail(email, token);
  }

  @Post('reset-password')
  async handleResetPassword(
    @Body('token') token: string,
    @Body('newPassword') newPassword: string,
  ): Promise<void> {
    const decoded = await this.jwtService.verify(token);

    const hashedPassword = encodePassword(newPassword);

    await this.usersService.updatePassword(decoded.email, hashedPassword);
  }

  @Post('update-email')
  @UseGuards(JwtAuthGuard, RoleAuthGuard)
  @Roles(Role.ADMIN, Role.USER)
  async updateEmail(
    @Body('email') email: string,
    @Body('userId') userId: string,
    @Res() response: Response,
  ) {
    const user = await this.usersService.findByEmail(email);

    const randomVerificationCode = generateVerificationCode();

    if (!user) {
      await this.emailsService.sendVerificationCode(
        email,
        randomVerificationCode,
      );
      return response.status(201).json({
        statusCode: 201,
      });
    } else if (user.id !== userId)
      throw new BadRequestException(
        'This email has already been used by another user!',
      );
    return response.status(200).json({
      statusCode: 200,
    });
  }

  @Post('verify-email')
  @UseGuards(JwtAuthGuard, RoleAuthGuard)
  @Roles(Role.ADMIN, Role.USER)
  async verifyEmail(
    @Body('verificationCode') verificationCode: string,
    @Body('newEmail') newEmail: string,
  ): Promise<any> {
    const code = await this.emailsService.findOneByCode(
      verificationCode,
      newEmail,
    );

    if (!code) throw new BadRequestException('Verify failed!');

    return { msg: 'Verify successfully!' };
  }
}
