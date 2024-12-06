import { DiscountStrategy } from 'src/payments/payments.interface';

export type Discount = {
  type: string;
  value: number;
};

export class PercentageDiscount implements DiscountStrategy {
  constructor(private readonly percentage: number) {}

  applyDiscount(amount: number): number {
    return Math.max(amount - (amount * this.percentage) / 100, 0);
  }
}

export class FixedAmountDiscount implements DiscountStrategy {
  constructor(private readonly discountAmount: number) {}

  applyDiscount(amount: number): number {
    return Math.max(amount - this.discountAmount, 0);
  }
}

export class DiscountStrategyFactory {
  static createDiscountStrategy(discount: Discount): DiscountStrategy {
    switch (discount.type) {
      case 'percentage': {
        return new PercentageDiscount(discount.value);
      }
      case 'fixed_amount': {
        return new FixedAmountDiscount(discount.value);
      }
      default:
        throw new Error('Invalid discount type.');
    }
  }
}
