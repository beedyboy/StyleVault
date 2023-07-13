import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Show } from '../entities/show.entity';
import { InventoryService } from '../inventory/inventory.service';
import { ISoldItem } from 'src/interfaces/show.interface';

@Injectable()
export class ShowService {
  constructor(
    @InjectRepository(Show)
    private readonly showRepository: Repository<Show>,
    private readonly inventoryService: InventoryService,
  ) {}

  async buyItem(showID: number, itemID: number): Promise<Show> {
    const inventory = await this.inventoryService.getInventoryByID(itemID);

    if (!inventory) {
      throw new NotFoundException('Inventory item not found');
    }

    if (inventory.quantity <= 0) {
      throw new BadRequestException('Item is out of stock');
    }

    inventory.quantity -= 1;
    await this.inventoryService.updateInventory(inventory);

    const show = this.showRepository.create({
      showID,
      quantitySold: 1,
      inventory,
    });

    return this.showRepository.save(show);
  }
  async findSoldItemsByShow(
    showId: number,
    itemId?: number,
  ): Promise<ISoldItem | ISoldItem[]> {
    const query = this.showRepository
      .createQueryBuilder('show')
      .leftJoinAndSelect('show.inventory', 'inventory')
      .select(['inventory.itemID', 'inventory.itemName', 'show.quantitySold'])
      .where('show.showID = :showId', { showId });

    if (itemId) {
      query.andWhere('inventory.itemID = :itemId', { itemId });
    }

    const results = await query.getMany();

    if (itemId) {
      // Cast the result to ISoldItem for single item
      return results[0] as unknown as ISoldItem;
    }
    // Return the results for multiple items
    return results as unknown as ISoldItem[];
  }
}
