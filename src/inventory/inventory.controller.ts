import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { InventoryItemDto } from 'src/dtos/inventory.dto';

@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post('create')
  async createInventory(
    @Body() inventoryItems: InventoryItemDto[],
  ): Promise<{ message: string; status: number }> {
    try {
      await Promise.all(
        inventoryItems.map((item) =>
          this.inventoryService.createInventory(item),
        ),
      );
      return {
        message: 'Inventory created successfully',
        status: HttpStatus.CREATED,
      };
    } catch (error) {
      return {
        message: error.message || 'Failed to create or update inventory',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }
  }
}
