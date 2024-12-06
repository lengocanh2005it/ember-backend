import { Module } from '@nestjs/common';
import { CartsService } from './carts.service';
import { CartsController } from './carts.controller';
import { ProductsModule } from 'src/products/products.module';
import { UsersModule } from 'src/users/users.module';
import { UsersService } from 'src/users/users.service';
import { RolesModule } from 'src/roles/roles.module';
import { PermissionsModule } from 'src/permissions/permissions.module';
import { DiscountsModule } from 'src/discounts/discounts.module';
import { OrdersModule } from 'src/orders/orders.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from 'src/carts/entities/carts.entity';
import { User } from 'src/users/entities/users.entity';
import { UserDiscountModule } from 'src/user-discount/user-discount.module';
import { UserDiscountService } from 'src/user-discount/user-discount.service';
import { ReservationsService } from 'src/reservations/reservations.service';
import { ReservationsModule } from 'src/reservations/reservations.module';
import { UserDiscount } from 'src/user-discount/entities/user-discount.entity';
import { Reservation } from 'src/reservations/entities/reservations.entity';
import { ProductsService } from 'src/products/products.service';
import { Product } from 'src/products/entities/products.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cart, User, UserDiscount, Reservation, Product]),
    ProductsModule,
    UsersModule,
    CartsModule,
    RolesModule,
    PermissionsModule,
    DiscountsModule,
    OrdersModule,
    UserDiscountModule,
    ReservationsModule,
  ],
  providers: [
    CartsService,
    UsersService,
    UserDiscountService,
    ReservationsService,
    ProductsService,
  ],
  controllers: [CartsController],
  exports: [CartsService],
})
export class CartsModule {}
