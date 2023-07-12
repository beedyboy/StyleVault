import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class InventoryDto {
  @IsNumber()
  itemID: number;

  @IsNotEmpty({ message: 'Item name is required' })
  @IsString()
  itemName: string;

  @IsNumber({}, { message: 'Quantity must be a number' })
  quantity: number;
}
