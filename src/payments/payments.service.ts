import { Injectable } from '@nestjs/common';
import { CreatePaymentDto } from 'src/payments/dtos/create-payment.dto';
import { DiscountStrategyFactory } from 'src/payments/strategies/discounts.strategy';
import { StripeStrategy } from 'src/payments/strategies/stripe.strategy';
import Stripe from 'stripe';

@Injectable()
export class PaymentsService {
  constructor(private readonly stripeStrategy: StripeStrategy) {}

  public handlePayment = async (
    createPaymentDto: CreatePaymentDto,
  ): Promise<boolean> => {
    const { userId, amount, source, discount } = createPaymentDto;
    let discountedAmount = amount;

    if (discount) {
      const discountStrategy =
        DiscountStrategyFactory.createDiscountStrategy(discount);
      discountedAmount = discountStrategy.applyDiscount(amount);
    }

    return this.stripeStrategy.processPayment(
      discountedAmount,
      'usd',
      source,
      userId,
    );
  };

  public getPayments = async (): Promise<any> => {
    return await this.stripeStrategy.getPayments();
  };

  public getPaymentIntentDetails = async (
    paymentIntentId: string,
  ): Promise<Stripe.PaymentIntent> => {
    return await this.stripeStrategy.getPaymentIntentDetails(paymentIntentId);
  };

  public getPaymentMethodDetails = async (
    paymentMethodId: string,
  ): Promise<Stripe.PaymentMethod> => {
    return await this.stripeStrategy.getPaymentMethodDetails(paymentMethodId);
  };
}
