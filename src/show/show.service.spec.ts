import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ShowService } from './show.service';
import { Show } from '../../src/entities/show.entity';
import { Inventory } from '../../src/entities/inventory.entity';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { InventoryService } from '../inventory/inventory.service';

describe('ShowService', () => {
  let service: ShowService;
  let showRepository: Repository<Show>;
  let inventoryService: InventoryService;
  let inventoryRepository: Repository<Inventory>;

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

    service = module.get<ShowService>(ShowService);
    showRepository = module.get<Repository<Show>>(getRepositoryToken(Show));
    inventoryService = module.get<InventoryService>(InventoryService);
    inventoryRepository = module.get<Repository<Inventory>>(
      getRepositoryToken(Inventory),
    );
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('buyItem', () => {
    it('should buy an item and update inventory', async () => {
      const showID = 1;
      const itemID = 12345;
      const inventory: Inventory = {
        itemID,
        itemName: 'Fancy Dress',
        quantity: 10,
        shows: [],
      };

      jest
        .spyOn(inventoryService, 'getInventoryByID')
        .mockResolvedValue(inventory);
      jest
        .spyOn(inventoryService, 'updateInventory')
        .mockImplementation(() => Promise.resolve(inventory));

      const saveSpy = jest
        .spyOn(showRepository, 'save')
        .mockImplementation((entity) => Promise.resolve(entity as Show));

      const showDto = { itemID };

      const result = await service.buyItem(showID, showDto);

      expect(inventoryService.getInventoryByID).toHaveBeenCalledTimes(1);
      expect(inventoryService.getInventoryByID).toHaveBeenCalledWith(itemID);

      expect(inventoryService.updateInventory).toHaveBeenCalledTimes(1);
      expect(inventoryService.updateInventory).toHaveBeenCalledWith({
        ...inventory,
        quantity: inventory.quantity - 1,
      });

      expect(saveSpy).toHaveBeenCalledTimes(1);
      expect(saveSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          showID,
          quantitySold: 1,
          inventory,
        }),
      );

      expect(result.showID).toEqual(showID);
      expect(result.quantitySold).toEqual(1);
      expect(result.inventory).toEqual(inventory);
    });

    it('should throw NotFoundException when inventory item is not found', async () => {
      const showID = 1;
      const itemID = 12345;

      jest
        .spyOn(inventoryService, 'getInventoryByID')
        .mockResolvedValue(undefined);

      const showDto = { itemID };

      await expect(service.buyItem(showID, showDto)).rejects.toThrowError(
        NotFoundException,
      );
      expect(inventoryService.getInventoryByID).toHaveBeenCalledTimes(1);
      expect(inventoryService.getInventoryByID).toHaveBeenCalledWith(itemID);
    });

    it('should throw BadRequestException when inventory item is out of stock', async () => {
      const showID = 1;
      const itemID = 12345;
      const inventory: Inventory = {
        itemID,
        itemName: 'Fancy Dress',
        quantity: 0,
        shows: [],
      };

      jest
        .spyOn(inventoryService, 'getInventoryByID')
        .mockResolvedValue(inventory);

      const showDto = { itemID };

      await expect(service.buyItem(showID, showDto)).rejects.toThrowError(
        BadRequestException,
      );
      expect(inventoryService.getInventoryByID).toHaveBeenCalledTimes(1);
      expect(inventoryService.getInventoryByID).toHaveBeenCalledWith(itemID);
    });
  });
});
