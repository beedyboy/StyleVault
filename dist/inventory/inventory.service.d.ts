import { InventoryItemDto } from '../dtos/inventory.dto';
import { Repository } from 'typeorm';
import { Inventory } from '../../src/entities/inventory.entity';
export declare class InventoryService {
    private readonly inventoryRepository;
    constructor(inventoryRepository: Repository<Inventory>);
    createInventory(inventoryItemDto: InventoryItemDto): Promise<Inventory>;
    getInventoryByID(itemID: number): Promise<Inventory>;
    updateInventory(inventory: Inventory): Promise<Inventory>;
}
