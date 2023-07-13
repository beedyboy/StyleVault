import { Repository } from 'typeorm';
import { Show } from '../../src/entities/show.entity';
import { InventoryService } from '../inventory/inventory.service';
import { ISoldItem } from 'src/interfaces/show.interface';
export declare class ShowService {
    private readonly showRepository;
    private readonly inventoryService;
    constructor(showRepository: Repository<Show>, inventoryService: InventoryService);
    buyItem(showID: number, itemID: number): Promise<Show>;
    findSoldItemsByShow(showId: number, itemId?: number): Promise<ISoldItem | ISoldItem[]>;
}
