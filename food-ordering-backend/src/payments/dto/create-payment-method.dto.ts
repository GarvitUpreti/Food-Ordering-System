import { IsString, IsNotEmpty, Matches, Length } from 'class-validator';

export class CreatePaymentMethodDto {
  @IsString()
  @IsNotEmpty()
  @Length(16, 16, { message: 'Card number must be 16 digits' })
  cardNumber: string;

  @IsString()
  @IsNotEmpty()
  cardHolderName: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^(0[1-9]|1[0-2])\/\d{2}$/, {
    message: 'Expiry date must be in MM/YY format',
  })
  expiryDate: string;

  @IsString()
  @IsNotEmpty()
  @Length(3, 3, { message: 'CVV must be 3 digits' })
  cvv: string;
}