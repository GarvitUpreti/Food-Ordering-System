import { IsEmail, IsNotEmpty, IsString, IsEnum, MinLength } from 'class-validator';
import { Role } from '../../common/enums/role.enum';
import { Country } from '../../common/enums/country.enum';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(Role)
  @IsNotEmpty()
  role: Role;

  @IsEnum(Country)
  @IsNotEmpty()
  country: Country;
}