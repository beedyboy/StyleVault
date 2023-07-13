import { Test, TestingModule } from '@nestjs/testing';
import { ShowController } from './show.controller';
import { ShowService } from './show.service';
import { Show } from '../entities/show.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Inventory } from '../../src/entities/inventory.entity';
import { InventoryService } from '../../src/inventory/inventory.service';
import { Repository } from 'typeorm';
import { ISoldItem } from 'src/interfaces/show.interface';

describe('controller', () => {
  let controller: ShowController;
  let service: ShowService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShowController],
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

    controller = module.get<ShowController>(ShowController);
    service = module.get<ShowService>(ShowService);
  });
  describe('buyItem', () => {
    it('should buy an item and return the show', async () => {
      const showID = 1;
      const itemID = 12345;
      const expectedShow: Show = {
        id: 1,
        showID,
        quantitySold: 1,
        inventory: {
          id: 1,
          itemID,
          itemName: 'Fancy Dress',
          quantity: 9,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      };

      jest.spyOn(service, 'buyItem').mockResolvedValue(expectedShow);

      const result = await controller.buyItem(showID, itemID);

      expect(result).toEqual(expectedShow);
      expect(service.buyItem).toHaveBeenCalledTimes(1);
      expect(service.buyItem).toHaveBeenCalledWith(showID, itemID);
    });

    it('should throw NotFoundException when show or inventory item not found', async () => {
      const showID = 1;
      const itemID = 12345;

      jest.spyOn(service, 'buyItem').mockRejectedValue(new NotFoundException());

      await expect(controller.buyItem(showID, itemID)).rejects.toThrowError(
        NotFoundException,
      );
      expect(service.buyItem).toHaveBeenCalledTimes(1);
      expect(service.buyItem).toHaveBeenCalledWith(showID, itemID);
    });

    it('should throw BadRequestException when there is insufficient inventory', async () => {
      const showID = 1;
      const itemID = 12345;

      jest
        .spyOn(service, 'buyItem')
        .mockRejectedValue(new BadRequestException());

      await expect(controller.buyItem(showID, itemID)).rejects.toThrowError(
        BadRequestException,
      );
      expect(service.buyItem).toHaveBeenCalledTimes(1);
      expect(service.buyItem).toHaveBeenCalledWith(showID, itemID);
    });

    it('should throw BadRequestException for other errors', async () => {
      const showID = 1;
      const itemID = 12345;

      jest.spyOn(service, 'buyItem').mockRejectedValue(new Error());

      await expect(controller.buyItem(showID, itemID)).rejects.toThrowError(
        BadRequestException,
      );
      expect(service.buyItem).toHaveBeenCalledTimes(1);
      expect(service.buyItem).toHaveBeenCalledWith(showID, itemID);
    });
  });
  describe('findSoldItemsByShow', () => {
    it('should return a single sold item when item ID is provided', async () => {
      const itemId = 12345;
      const showId = 789;

      // Mock the service method to return a single sold item
      const soldItem: ISoldItem = {
        itemID: itemId,
        itemName: 'Fancy Dress',
        quantitySold: 4,
      };
      jest.spyOn(service, 'findSoldItemsByShow').mockResolvedValue(soldItem);

      const result = await controller.findSoldItemsByShow(showId, itemId);

      expect(result).toEqual(soldItem);
    });

    it('should return an array of sold items when item ID is not provided', async () => {
      const showId = 789;

      // Mock the service method to return an array of sold items
      const soldItems: ISoldItem[] = [
        {
          itemID: 12345,
          itemName: 'Fancy Dress',
          quantitySold: 4,
        },
        // Add more sold items as needed
      ];
      jest.spyOn(service, 'findSoldItemsByShow').mockResolvedValue(soldItems);

      const result = await controller.findSoldItemsByShow(showId);

      expect(result).toEqual(soldItems);
    });
  });
});
