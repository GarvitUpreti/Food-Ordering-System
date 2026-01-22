import { IsString, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';
import { Country } from '../../common/enums/country.enum';

export class CreateRestaurantDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(Country)
  @IsNotEmpty()
  country: Country;

  @IsString()
  @IsOptional()
  imageUrl?: string;
}