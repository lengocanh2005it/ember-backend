import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RoleAuthGuard } from 'src/auth/guards/role.guard';
import { CreatePaymentDto } from 'src/payments/dtos/create-payment.dto';
import { PaymentsService } from 'src/payments/payments.service';
import { Roles } from 'src/roles/role.decorator';
import { Role } from 'src/roles/role.enum';
import Stripe from 'stripe';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RoleAuthGuard)
  @Roles(Role.ADMIN)
  async getPayments(): Promise<Stripe.PaymentIntent[]> {
    return await this.paymentsService.getPayments();
  }

  @Get('intents/:id')
  @UseGuards(JwtAuthGuard, RoleAuthGuard)
  @Roles(Role.ADMIN)
  async getPaymentIntentDetails(
    @Param('id') paymentIntentId: string,
  ): Promise<Stripe.PaymentIntent> {
    return await this.paymentsService.getPaymentIntentDetails(paymentIntentId);
  }

  @Get('methods/:id')
  @UseGuards(JwtAuthGuard, RoleAuthGuard)
  @Roles(Role.ADMIN)
  async getPaymentMethodDetails(
    @Param('id') paymentMethodId: string,
  ): Promise<Stripe.PaymentMethod> {
    return await this.paymentsService.getPaymentMethodDetails(paymentMethodId);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RoleAuthGuard)
  @Roles(Role.ADMIN, Role.USER)
  async handlePayment(@Body() createPaymentDto: CreatePaymentDto) {
    const response = await this.paymentsService.handlePayment(createPaymentDto);

    return response === true
      ? { msg: 'Payment successfully!' }
      : { msg: 'Payment failed!' };
  }
}
