import { IsEmail, IsOptional, IsString, IsEnum } from 'class-validator';
import { Role } from '../../common/enums/role.enum';
import { Country } from '../../common/enums/country.enum';

export class UpdateUserDto {
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsEnum(Role)
  @IsOptional()
  role?: Role;

  @IsEnum(Country)
  @IsOptional()
  country?: Country;
}