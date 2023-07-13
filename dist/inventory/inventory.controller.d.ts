import { InventoryService } from './inventory.service';
import { InventoryItemDto } from 'src/dtos/inventory.dto';
export declare class InventoryController {
    private readonly inventoryService;
    constructor(inventoryService: InventoryService);
    createInventory(inventoryItems: InventoryItemDto[]): Promise<{
        message: string;
        status: number;
    }>;
}
