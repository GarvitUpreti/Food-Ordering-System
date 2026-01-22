import { IsInt, Min, IsNotEmpty } from 'class-validator';

export class UpdateItemDto {
  @IsInt()
  @Min(1)
  @IsNotEmpty()
  quantity: number;
}