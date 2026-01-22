import { IsString, IsOptional, IsEnum } from 'class-validator';
import { Country } from '../../common/enums/country.enum';

export class UpdateRestaurantDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(Country)
  @IsOptional()
  country?: Country;

  @IsString()
  @IsOptional()
  imageUrl?: string;
}