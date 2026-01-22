export interface PaymentMethod {
  id: string;
  userId: string;
  cardNumber: string; // Last 4 digits
  cardHolderName: string;
  expiryDate: string;
  cvv: string; // Encrypted
}

export interface CreatePaymentMethodDto {
  cardNumber: string;
  cardHolderName: string;
  expiryDate: string;
  cvv: string;
}

export interface UpdatePaymentMethodDto {
  cardNumber?: string;
  cardHolderName?: string;
  expiryDate?: string;
  cvv?: string;
}