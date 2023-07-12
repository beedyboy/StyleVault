import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ShowService } from './show.service';
import { InventoryService } from '../inventory/inventory.service';
import { Show } from '../entities/show.entity';
import { Inventory } from '../entities/inventory.entity';

describe('ShowService', () => {
  let showService: ShowService;
  let inventoryService: InventoryService;
  let showRepository: Repository<Show>;
  let inventoryRepository: Repository<Inventory>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        ShowService,
        InventoryService,
        {
          provide: getRepositoryToken(Show),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Inventory),
          useClass: Repository,
        },
      ],
    }).compile();

    showService = moduleRef.get<ShowService>(ShowService);
    inventoryService = moduleRef.get<InventoryService>(InventoryService);
    showRepository = moduleRef.get<Repository<Show>>(getRepositoryToken(Show));
    inventoryRepository = moduleRef.get<Repository<Inventory>>(
      getRepositoryToken(Inventory),
    );
  });

  describe('buyItem', () => {
    it('should buy an item and update inventory and show', async () => {
      const inventory = new Inventory();
      inventory.id = 1;
      inventory.itemID = 1234;
      inventory.itemName = 'Fancy Dress';
      inventory.quantity = 10;

      const itemID = 1234;
      const showId = 1245;

      const show = new Show();
      show.id = 1;
      show.showID = 1245;
      show.quantitySold = 0;
      show.inventory = inventory;

      const inventoryServiceGetInventoryByIdSpy = jest
        .spyOn(inventoryService, 'getInventoryByID')
        .mockResolvedValue(inventory);

      const inventoryServiceUpdateInventorySpy = jest
        .spyOn(inventoryService, 'updateInventory')
        .mockResolvedValue(inventory);

      const showRepositoryCreateSpy = jest
        .spyOn(showRepository, 'create')
        .mockReturnValue(show);

      const showRepositorySaveSpy = jest
        .spyOn(showRepository, 'save')
        .mockResolvedValue(show);

      const result = await showService.buyItem(showId, itemID);

      expect(inventoryServiceGetInventoryByIdSpy).toHaveBeenCalledWith(1);
      expect(inventoryServiceUpdateInventorySpy).toHaveBeenCalledWith(
        inventory,
      );
      expect(showRepositoryCreateSpy).toHaveBeenCalledWith({
        showID: 1245,
        quantitySold: 1,
        inventory,
      });
      expect(showRepositorySaveSpy).toHaveBeenCalledWith(show);
      expect(result).toEqual(show);
    });

    it('should throw NotFoundException when inventory item is not found', async () => {
      const inventoryServiceGetInventoryByIdSpy = jest
        .spyOn(inventoryService, 'getInventoryByID')
        .mockResolvedValue(undefined);

      await expect(showService.buyItem(1, 1)).rejects.toThrowError(
        NotFoundException,
      );
      expect(inventoryServiceGetInventoryByIdSpy).toHaveBeenCalledWith(1);
    });

    it('should throw BadRequestException when item is out of stock', async () => {
      const inventory = new Inventory();
      inventory.id = 1;
      inventory.itemID = 1;
      inventory.itemName = 'Test Item';
      inventory.quantity = 0;

      const inventoryServiceGetInventoryByIdSpy = jest
        .spyOn(inventoryService, 'getInventoryByID')
        .mockResolvedValue(inventory);

      await expect(showService.buyItem(1, 1)).rejects.toThrowError(
        BadRequestException,
      );
      expect(inventoryServiceGetInventoryByIdSpy).toHaveBeenCalledWith(1);
    });
  });

});
