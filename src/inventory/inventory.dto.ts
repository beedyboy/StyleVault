import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class InventoryItemDto {
  @IsNumber()
  itemID: number;

  @IsNotEmpty({ message: 'Item name is required' })
  @IsString()
  itemName: string;

  @IsNumber({}, { message: 'Quantity must be a number' })
  quantity: number;
}

export class InventoryDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => InventoryItemDto)
  items: InventoryItemDto[];
}
