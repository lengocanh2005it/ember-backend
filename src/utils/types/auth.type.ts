export type UserGoogleDetails = {
  email: string;
  displayName: string;
  googleId: string;
};

export type UserFacebookDetails = {
  email: string;
  displayName: string;
  facebookId: string;
};

export type OrderPaymentPayload = {
  orderId: string;
  userId: string;
  totalPrice: number;
};

export type ReservationPaymentPayload = {
  reservationId: string;
  userId: string;
  totalPrice: number;
  totalPriceInput: number;
};

export type UserSessionPayload = {
  userId: string;
  accessToken: string;
  refreshToken: string;
};
