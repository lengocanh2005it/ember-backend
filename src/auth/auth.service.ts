import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { config } from 'dotenv';
import { AuthPayloadDto } from 'src/auth/dtos/auth.dto';
import dataSource from 'src/database/data-source';
import { OrdersService } from 'src/orders/orders.service';
import { ReservationsService } from 'src/reservations/reservations.service';
import { RolesService } from 'src/roles/roles.service';
import { User } from 'src/users/entities/users.entity';
import { UsersService } from 'src/users/users.service';
import {
  UserFacebookDetails,
  UserGoogleDetails,
} from 'src/utils/types/auth.type';

config();

@Injectable()
export class AuthService {
  constructor(
    private readonly roleService: RolesService,
    private readonly usersService: UsersService,
    private readonly orderService: OrdersService,
    private readonly reservationsService: ReservationsService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser({
    username,
    password,
  }: AuthPayloadDto): Promise<Record<string, string>> {
    const findUser = await this.usersService.findByUsername(username);

    const isMatch = bcrypt.compareSync(password, findUser.password);

    if (!findUser || !isMatch)
      throw new UnauthorizedException('Invalid Credentials.');

    const { id } = findUser;

    const accessToken = this.jwtService.sign(
      { userId: id },
      {
        expiresIn: process.env.ACCESS_TOKEN_LIFE!,
      },
    );

    const refreshToken = this.jwtService.sign(
      { userId: id },
      {
        expiresIn: process.env.REFRESH_TOKEN_LIFE!,
      },
    );

    return {
      accessToken,
      refreshToken,
      userId: id,
    };
  }

  async validateUserGoogle(
    details: UserGoogleDetails,
  ): Promise<Record<string, any>> {
    const { googleId, displayName, email } = details;

    const user = await this.usersService.findUserBySocialId(
      'google_id',
      googleId,
    );

    if (user) {
      const payload = { userId: user.id };

      const accessToken = this.jwtService.sign(payload, {
        expiresIn: process.env.ACCESS_TOKEN_LIFE!,
      });

      const refreshToken = this.jwtService.sign(payload, {
        expiresIn: process.env.REFRESH_TOKEN_LIFE!,
      });

      return { user, accessToken, refreshToken };
    }

    const newUser = await this.usersService.createUserBySocialId(
      'google_id',
      googleId,
      displayName,
      email,
    );

    const role = await this.roleService.findRoleByName('user');

    await dataSource
      .createQueryBuilder()
      .relation(User, 'roles')
      .of(newUser.id)
      .add(role.id);

    const payload = {
      userId: newUser.id,
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: process.env.ACCESS_TOKEN_LIFE!,
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: process.env.REFRESH_TOKEN_LIFE!,
    });

    return {
      user: newUser,
      accessToken,
      refreshToken,
    };
  }

  async validateUserFacebook(
    details: UserFacebookDetails,
  ): Promise<Record<string, any>> {
    const { facebookId, email, displayName } = details;
    const user = await this.usersService.findUserBySocialId(
      'facebook_id',
      details.facebookId,
    );

    if (user) {
      const payload = { userId: user.id };

      const accessToken = this.jwtService.sign(payload, {
        expiresIn: process.env.ACCESS_TOKEN_LIFE!,
      });

      const refreshToken = this.jwtService.sign(payload, {
        expiresIn: process.env.REFRESH_TOKEN_LIFE!,
      });

      return {
        user,
        accessToken,
        refreshToken,
      };
    }

    const newUser = await this.usersService.createUserBySocialId(
      'facebook_id',
      facebookId,
      displayName,
      email,
    );

    const role = await this.roleService.findRoleByName('user');

    await dataSource
      .createQueryBuilder()
      .relation(User, 'roles')
      .of(newUser.id)
      .add(role.id);

    const payload = {
      userId: newUser.id,
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: process.env.ACCESS_TOKEN_LIFE!,
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: process.env.REFRESH_TOKEN_LIFE!,
    });

    return {
      user,
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(token: string): Promise<string> {
    const { username, email } = this.jwtService.verify(token, {
      secret: process.env.JWT_SECRET_KEY!,
    });

    let user = null as User;

    if (username) {
      user = await this.usersService.findByUsername(username);
    } else if (email) {
      user = await this.usersService.findOneByEmail(email);
    }

    if (!user) throw new UnauthorizedException('Unauthenticated.');

    const payload = {
      userId: user.id,
    };

    return this.jwtService.sign(payload, {
      expiresIn: process.env.ACCESS_TOKEN_LIFE!,
    });
  }

  async handlePaymentOrderByCreditCard(
    totalPrice: number,
    orderId: string,
    userId: string,
  ): Promise<any> {
    const order = await this.orderService.findOne(orderId);

    // logic here

    console.log(order, userId, totalPrice);
  }

  async handlePaymentReservationByCreditCart(
    reservationId: string,
    userId: string,
    totalPriceInput: number,
    totalPrice: number,
  ): Promise<void> {
    const reservation = await this.reservationsService.findOne(reservationId);

    const user = await this.usersService.findOne(userId);

    // logic here

    console.log(reservation, user, totalPriceInput, totalPrice);
  }

  async generateResetToken(email: string): Promise<string> {
    const payload = { email };
    return this.jwtService.sign(payload);
  }
}
