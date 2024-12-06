import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { config } from 'dotenv';
import { Payment } from 'src/payments/entities/payments.entity';
import { PaymentStrategy } from 'src/payments/payments.interface';
import { UsersService } from 'src/users/users.service';
import Stripe from 'stripe';
import { Repository } from 'typeorm';

config();

@Injectable()
export class StripeStrategy implements PaymentStrategy {
  private stripe: Stripe;

  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    private readonly usersService: UsersService,
  ) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-11-20.acacia',
    });
  }

  async processPayment(
    amount: number,
    currency: string = 'usd',
    source: string,
    userId: string,
  ): Promise<boolean> {
    try {
      const payment = await this.stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // cents
        currency,
        payment_method: source,
        confirm: true,
        automatic_payment_methods: {
          enabled: true,
          allow_redirects: 'never',
        },
      });

      const user = await this.usersService.findOne(userId);

      if (!user) throw new NotFoundException('User Not Found.');

      const { id, payment_method, status } = payment;

      const newPayment = this.paymentRepository.create({
        payment_intent_id: id,
        payment_method_id: payment_method as string,
        user,
        amount: payment.amount,
        currency: payment.currency,
        status,
      });

      await this.paymentRepository.save(newPayment);

      return true;
    } catch (err) {
      return false;
    }
  }

  async getPayments(limit: number = 10): Promise<Stripe.PaymentIntent[]> {
    const paymentIntents = await this.stripe.paymentIntents.list({
      limit,
    });

    return paymentIntents.data;
  }

  async getPaymentIntentDetails(
    paymentIntentId: string,
  ): Promise<Stripe.PaymentIntent> {
    const paymentIntent =
      await this.stripe.paymentIntents.retrieve(paymentIntentId);
    if (!paymentIntent) throw new NotFoundException('Payment not found!');
    return paymentIntent;
  }

  async getPaymentMethodDetails(
    paymentMethodId: string,
  ): Promise<Stripe.PaymentMethod> {
    const paymentMethod =
      await this.stripe.paymentMethods.retrieve(paymentMethodId);
    if (!paymentMethod)
      throw new NotFoundException('Payment Method not found!');
    return paymentMethod;
  }
}
