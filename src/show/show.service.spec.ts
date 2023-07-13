import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { ShowService } from './show.service';
import { Show } from '../../src/entities/show.entity';
import { Inventory } from '../../src/entities/inventory.entity';
import { InventoryService } from '../../src/inventory/inventory.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('ShowService', () => {
  let showService: ShowService;
  let showRepository: Repository<Show>;
  let inventoryService: InventoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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

    showService = module.get<ShowService>(ShowService);
    showRepository = module.get<Repository<Show>>(getRepositoryToken(Show));
    inventoryService = module.get<InventoryService>(InventoryService);
  });
  describe('buyItem', () => {
    it('should buy an item and update inventory and show', async () => {
      const inventory = new Inventory();
      inventory.id = 1;
      inventory.itemID = 1234;
      inventory.itemName = 'Fancy Dress';
      inventory.quantity = 10;

      const itemID = 1234;
      const showID = 1245;

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

      const result = await showService.buyItem(showID, itemID);

      expect(inventoryServiceGetInventoryByIdSpy).toHaveBeenCalledWith(itemID);
      expect(inventoryServiceUpdateInventorySpy).toHaveBeenCalledWith(
        inventory,
      );
      expect(showRepositoryCreateSpy).toHaveBeenCalledWith({
        showID,
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

  describe('findSoldItemsByShow', () => {
    it('should return an array of sold items for the provided showID', async () => {
      // Mock the query result
      const mockQueryResult = [
        {
          itemID: 12345,
          itemName: 'Fancy Dress',
          quantitySold: 4,
        },
        {
          itemID: 67890,
          itemName: 'Magic Wand',
          quantitySold: 2,
        },
      ];
      // Set the return value of getMany on mockQueryBuilder
      jest.spyOn(showRepository, 'createQueryBuilder').mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValueOnce(mockQueryResult),
      } as any);

      const result = await showService.findSoldItemsByShow(123);

      expect(result).toEqual([
        {
          itemID: 12345,
          itemName: 'Fancy Dress',
          quantitySold: 4,
        },
        {
          itemID: 67890,
          itemName: 'Magic Wand',
          quantitySold: 2,
        },
      ]);
    });

    it('should return a single sold item for the provided showID and itemID', async () => {
      // Mock the query result
      const mockQueryResult = [
        {
          itemID: 12345,
          itemName: 'Fancy Dress',
          quantitySold: 4,
        },
      ];
      // Set the return value of getMany on mockQueryBuilder
      jest.spyOn(showRepository, 'createQueryBuilder').mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValueOnce(mockQueryResult),
      } as any);

      const result = await showService.findSoldItemsByShow(123, 12345);

      expect(result).toEqual({
        itemID: 12345,
        itemName: 'Fancy Dress',
        quantitySold: 4,
      });
    });
  });
});
