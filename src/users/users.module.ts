import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiscountsModule } from 'src/discounts/discounts.module';
import { DiscountsService } from 'src/discounts/discounts.service';
import { OrdersModule } from 'src/orders/orders.module';
import { OrdersService } from 'src/orders/orders.service';
import { PermissionsModule } from 'src/permissions/permissions.module';
import { PermissionsService } from 'src/permissions/permissions.service';
import { ReservationsModule } from 'src/reservations/reservations.module';
import { ReservationsService } from 'src/reservations/reservations.service';
import { RolesModule } from 'src/roles/roles.module';
import { RolesService } from 'src/roles/roles.service';
import { UserDiscountModule } from 'src/user-discount/user-discount.module';
import { UserDiscountService } from 'src/user-discount/user-discount.service';
import { User } from 'src/users/entities/users.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { Role } from 'src/roles/entities/roles.entity';
import { Permission } from 'src/permissions/entities/permissions.entity';
import { Discount } from 'src/discounts/entities/discounts.entity';
import { Reservation } from 'src/reservations/entities/reservations.entity';
import { UserDiscount } from 'src/user-discount/entities/user-discount.entity';
import { Order } from 'src/orders/entities/orders.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Role,
      Permission,
      Discount,
      Reservation,
      UserDiscount,
      Order,
    ]),
    OrdersModule,
    RolesModule,
    PermissionsModule,
    DiscountsModule,
    ReservationsModule,
    UserDiscountModule,
  ],
  providers: [
    RolesService,
    PermissionsService,
    UsersService,
    DiscountsService,
    UserDiscountService,
    ReservationsService,
    OrdersService,
  ],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
