"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShowService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const show_entity_1 = require("../../src/entities/show.entity");
const inventory_service_1 = require("../inventory/inventory.service");
let ShowService = class ShowService {
    constructor(showRepository, inventoryService) {
        this.showRepository = showRepository;
        this.inventoryService = inventoryService;
    }
    async buyItem(showID, itemID) {
        const inventory = await this.inventoryService.getInventoryByID(itemID);
        if (!inventory) {
            throw new common_1.NotFoundException('Inventory item not found');
        }
        if (inventory.quantity <= 0) {
            throw new common_1.BadRequestException('Item is out of stock');
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
    async findSoldItemsByShow(showId, itemId) {
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
            return results[0];
        }
        return results;
    }
};
ShowService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(show_entity_1.Show)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        inventory_service_1.InventoryService])
], ShowService);
exports.ShowService = ShowService;
//# sourceMappingURL=show.service.js.map