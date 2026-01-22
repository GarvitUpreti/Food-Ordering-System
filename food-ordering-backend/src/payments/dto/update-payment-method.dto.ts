import { IsString, IsOptional, Matches, Length } from 'class-validator';

export class UpdatePaymentMethodDto {
  @IsString()
  @IsOptional()
  @Length(16, 16)
  cardNumber?: string;

  @IsString()
  @IsOptional()
  cardHolderName?: string;

  @IsString()
  @IsOptional()
  @Matches(/^(0[1-9]|1[0-2])\/\d{2}$/)
  expiryDate?: string;

  @IsString()
  @IsOptional()
  @Length(3, 3)
  cvv?: string;
}