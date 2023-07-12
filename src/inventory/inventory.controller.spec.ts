import { HttpStatus, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { InventoryController } from './inventory.controller';
import { InventoryService } from './inventory.service';

describe('InventoryController', () => {
  let controller: InventoryController;
  let service: InventoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InventoryController],
      providers: [
        {
          provide: InventoryService,
          useValue: {
            createInventory: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<InventoryController>(InventoryController);
    service = module.get<InventoryService>(InventoryService);
  });

  describe('createInventory', () => {
    it('should create inventory items and return success message', async () => {
      const inventoryItems = [
        { itemID: 1, itemName: 'Item 1', quantity: 5 },
        { itemID: 2, itemName: 'Item 2', quantity: 10 },
      ];

      await controller.createInventory(inventoryItems);

      expect(service.createInventory).toHaveBeenCalledTimes(2);
      expect(service.createInventory).toHaveBeenCalledWith(inventoryItems[0]);
      expect(service.createInventory).toHaveBeenCalledWith(inventoryItems[1]);
    });

    it('should return error message and status code if inventory creation fails', async () => {
      const inventoryItems = [
        { itemID: 1, itemName: 'Item 1', quantity: 5 },
        { itemID: 2, itemName: 'Item 2', quantity: 10 },
      ];

      const errorMessage = 'Failed to create or update inventory';
      jest.spyOn(service, 'createInventory').mockImplementation(() => {
        throw new Error(errorMessage);
      });

      const result = await controller.createInventory(inventoryItems);

      expect(result).toEqual({
        message: errorMessage,
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    });
  });
});
