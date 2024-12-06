import { CacheModule } from '@nestjs/cache-manager';
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as redisStore from 'cache-manager-redis-store';
import { config } from 'dotenv';
import { dataSourceOptions } from 'src/database/data-source';
import { FormatResponseApiInterceptor } from 'src/utils/formatResponseApi.interceptor';
import { HttpExceptionFilter } from 'src/utils/http-exception.filter';
import { LoggerMiddleware } from 'src/utils/logger-middleware';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AreasModule } from './areas/areas.module';
import { AuthModule } from './auth/auth.module';
import { CartsModule } from './carts/carts.module';
import { DiscountsModule } from './discounts/discounts.module';
import { EmailsModule } from './emails/emails.module';
import { EventsModule } from './events/events.module';
import { NotificationsModule } from './notifications/notifications.module';
import { OrderProductModule } from './order-product/order-product.module';
import { OrdersModule } from './orders/orders.module';
import { PaymentsModule } from './payments/payments.module';
import { PermissionsModule } from './permissions/permissions.module';
import { ProductsModule } from './products/products.module';
import { PromotionsModule } from './promotions/promotions.module';
import { ReservationsModule } from './reservations/reservations.module';
import { ReviewsModule } from './reviews/reviews.module';
import { RolesModule } from './roles/roles.module';
import { SupportTicketModule } from './support_ticket/support-ticket.module';
import { TablesModule } from './tables/tables.module';
import { UploadsModule } from './uploads/uploads.module';
import { UserDiscountModule } from './user-discount/user-discount.module';
import { UsersModule } from './users/users.module';

config();

@Module({
  imports: [
    CacheModule.register({
      max: 100,
      ttl: 20,
      isGlobal: true,
      store: redisStore,
      url: `redis://${process.env.REDIS_HOST || 'redis'}:${process.env.REDIS_PORT || 6379}`,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
    }),
    TypeOrmModule.forRoot(dataSourceOptions),
    UsersModule,
    AuthModule,
    RolesModule,
    PermissionsModule,
    ThrottlerModule.forRoot([
      {
        ttl: 10000,
        limit: 10,
      },
      {
        name: 'long',
        ttl: 50000,
        limit: 30,
      },
    ]),
    ProductsModule,
    OrdersModule,
    CartsModule,
    DiscountsModule,
    UserDiscountModule,
    OrderProductModule,
    ReservationsModule,
    NotificationsModule,
    ReviewsModule,
    EventsModule,
    PromotionsModule,
    SupportTicketModule,
    UploadsModule,
    EmailsModule,
    PaymentsModule,
    TablesModule,
    AreasModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: FormatResponseApiInterceptor,
    },
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
