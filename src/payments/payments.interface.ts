export interface DiscountStrategy {
  applyDiscount(amount: number): number;
}

export interface PaymentStrategy {
  processPayment(
    amount: number,
    currency: string,
    source: string,
    userId: string,
  ): Promise<boolean>;
}
