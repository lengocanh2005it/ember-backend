import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from 'src/payments/entities/payments.entity';
import { StripeStrategy } from 'src/payments/strategies/stripe.strategy';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/users.entity';
import { UsersModule } from 'src/users/users.module';
import { OrdersService } from 'src/orders/orders.service';
import { OrdersModule } from 'src/orders/orders.module';
import { RolesModule } from 'src/roles/roles.module';
import { RolesService } from 'src/roles/roles.service';
import { PermissionsModule } from 'src/permissions/permissions.module';
import { PermissionsService } from 'src/permissions/permissions.service';
import { DiscountsModule } from 'src/discounts/discounts.module';
import { DiscountsService } from 'src/discounts/discounts.service';
import { UserDiscountService } from 'src/user-discount/user-discount.service';
import { ReservationsModule } from 'src/reservations/reservations.module';
import { UserDiscountModule } from 'src/user-discount/user-discount.module';
import { ReservationsService } from 'src/reservations/reservations.service';
import { Order } from 'src/orders/entities/orders.entity';
import { Role } from 'src/roles/entities/roles.entity';
import { Permission } from 'src/permissions/entities/permissions.entity';
import { Discount } from 'src/discounts/entities/discounts.entity';
import { UserDiscount } from 'src/user-discount/entities/user-discount.entity';
import { Reservation } from 'src/reservations/entities/reservations.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Payment,
      User,
      Order,
      Role,
      Permission,
      Discount,
      UserDiscount,
      Reservation,
    ]),
    UsersModule,
    OrdersModule,
    RolesModule,
    PermissionsModule,
    DiscountsModule,
    UserDiscountModule,
    ReservationsModule,
  ],
  providers: [
    PaymentsService,
    StripeStrategy,
    UsersService,
    OrdersService,
    RolesService,
    PermissionsService,
    DiscountsService,
    UserDiscountService,
    ReservationsService,
  ],
  controllers: [PaymentsController],
  exports: [PaymentsService],
})
export class PaymentsModule {}
