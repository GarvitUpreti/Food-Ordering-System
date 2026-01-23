import { IsEmail, IsOptional, IsString, IsEnum, MinLength } from 'class-validator';
import { Role } from '../../common/enums/role.enum';
import { Country } from '../../common/enums/country.enum';

export class UpdateUserDto {
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  @MinLength(6)
  password?: string;  

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