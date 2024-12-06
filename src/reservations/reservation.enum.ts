export enum ReservationEnum {
  INDOOR = 'indoor',
  OUTDOOR = 'outdoor',
  VIP = 'vip',
  WINDOW = 'window',
  CREDIT_CARD = 'credit-card',
  PAYPAL = 'paypal',
  CASH = 'cash',
  SUCCESS = 'success',
  PENDING = 'pending',
  ERROR = 'error',
}

export enum ReservationTypePrice {
  INDOOR = 200,
  OUTDOOR = 250,
  VIP = 300,
}

export const priceForOnePerson: number = 100;
