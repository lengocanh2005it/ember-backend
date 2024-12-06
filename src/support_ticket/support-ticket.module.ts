import { Module } from '@nestjs/common';
import { SupportTicketService } from './support-ticket.service';
import { SupportTicketController } from './support-ticket.controller';
import { UsersModule } from 'src/users/users.module';
import { RolesModule } from 'src/roles/roles.module';
import { PermissionsModule } from 'src/permissions/permissions.module';
import { DiscountsModule } from 'src/discounts/discounts.module';
import { OrdersModule } from 'src/orders/orders.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/users.entity';
import { UsersService } from 'src/users/users.service';
import { SupportTicket } from 'src/support_ticket/entities/support-ticket.entity';
import { UserDiscountModule } from 'src/user-discount/user-discount.module';
import { UserDiscountService } from 'src/user-discount/user-discount.service';
import { ReservationsModule } from 'src/reservations/reservations.module';
import { ReservationsService } from 'src/reservations/reservations.service';
import { UserDiscount } from 'src/user-discount/entities/user-discount.entity';
import { Reservation } from 'src/reservations/entities/reservations.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([SupportTicket, User, UserDiscount, Reservation]),
    UsersModule,
    RolesModule,
    PermissionsModule,
    DiscountsModule,
    OrdersModule,
    UserDiscountModule,
    ReservationsModule,
  ],
  providers: [
    UsersService,
    SupportTicketService,
    UserDiscountService,
    ReservationsService,
  ],
  controllers: [SupportTicketController],
  exports: [SupportTicketService],
})
export class SupportTicketModule {}
