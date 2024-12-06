import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from 'src/auth/strategies/local.strategy';
import { JwtStrategy } from 'src/auth/strategies/jwt.strategy';
import { RolesModule } from 'src/roles/roles.module';
import { GoogleStrategy } from 'src/auth/strategies/google.strategy';
import { RolesService } from 'src/roles/roles.service';
import { PermissionsService } from 'src/permissions/permissions.service';
import { PermissionsModule } from 'src/permissions/permissions.module';
import { SessionSerializer } from 'src/auth/utils/serializer';
import { FacebookStrategy } from 'src/auth/strategies/facebook.strategy';
import { config } from 'dotenv';
import { UsersService } from 'src/users/users.service';
import { DiscountsModule } from 'src/discounts/discounts.module';
import { OrdersModule } from 'src/orders/orders.module';
import { OrdersService } from 'src/orders/orders.service';
import { ReservationsModule } from 'src/reservations/reservations.module';
import { ReservationsService } from 'src/reservations/reservations.service';
import { ProductsModule } from 'src/products/products.module';
import { EmailsModule } from 'src/emails/emails.module';
import { EmailsService } from 'src/emails/emails.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Email } from 'src/emails/entities/emails.entity';
import { UploadsService } from 'src/uploads/uploads.service';
import { UploadsModule } from 'src/uploads/uploads.module';
import { Role } from 'src/roles/entities/roles.entity';
import { Permission } from 'src/permissions/entities/permissions.entity';
import { Order } from 'src/orders/entities/orders.entity';
import { User } from 'src/users/entities/users.entity';
import { UserDiscountModule } from 'src/user-discount/user-discount.module';
import { UserDiscountService } from 'src/user-discount/user-discount.service';
import { Reservation } from 'src/reservations/entities/reservations.entity';
import { UserDiscount } from 'src/user-discount/entities/user-discount.entity';

config();

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Email,
      Role,
      Permission,
      Order,
      User,
      Reservation,
      UserDiscount,
    ]),
    PassportModule,
    UsersModule,
    RolesModule,
    PermissionsModule,
    DiscountsModule,
    UploadsModule,
    OrdersModule,
    ReservationsModule,
    UserDiscountModule,
    ProductsModule,
    EmailsModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY!,
      signOptions: { expiresIn: process.env.ACCESS_TOKEN_LIFE! },
    }),
    PassportModule.register({
      session: true,
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    EmailsService,
    RolesService,
    PermissionsService,
    OrdersService,
    UsersService,
    ReservationsService,
    UserDiscountService,
    UploadsService,
    LocalStrategy,
    JwtStrategy,
    GoogleStrategy,
    FacebookStrategy,
    SessionSerializer,
  ],
})
export class AuthModule {}
