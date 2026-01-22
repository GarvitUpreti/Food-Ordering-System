import { IsUUID, IsInt, Min, IsNotEmpty } from 'class-validator';

export class AddItemDto {
  @IsUUID()
  @IsNotEmpty()
  menuItemId: string;

  @IsInt()
  @Min(1)
  @IsNotEmpty()
  quantity: number;
}