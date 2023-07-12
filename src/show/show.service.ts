import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Show } from '../entities/show.entity';
import { InventoryService } from '../inventory/inventory.service';

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

  async findSoldItemsByShow(showID: number, itemID?: number): Promise<Show[]> {
    const queryBuilder = this.showRepository
      .createQueryBuilder('show')
      .where('show.showID = :showID', { showID });

    if (itemID) {
      queryBuilder.andWhere('show.inventory.itemID = :itemID', { itemID });
    }

    return queryBuilder.getMany();
  }
}
