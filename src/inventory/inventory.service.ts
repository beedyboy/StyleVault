import { Injectable, NotFoundException } from '@nestjs/common';
import { InventoryItemDto } from './inventory.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inventory } from './inventory.entity';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(Inventory)
    private readonly inventoryRepository: Repository<Inventory>,
  ) {}

  async createInventory(
    inventoryItemDto: InventoryItemDto,
  ): Promise<Inventory> {
    const { itemID, itemName, quantity } = inventoryItemDto;

    // Check if an item with the given itemID already exists
    let inventory = await this.inventoryRepository.findOne({
      where: { itemID },
    });

    if (inventory) {
      // Update the existing inventory item
      inventory.itemName = itemName;
      inventory.quantity = quantity;
    } else {
      // Create a new inventory item
      inventory = this.inventoryRepository.create({
        itemID,
        itemName,
        quantity,
      });
    }

    try {
      // Save the inventory item
      return await this.inventoryRepository.save(inventory);
    } catch (error) {
      // Handle any potential errors during saving
      throw new Error(error.message || 'Failed to create or update inventory');
    }
  }
}
