import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InventoryService } from './inventory.service';
import { InventoryItemDto } from './inventory.dto';
import { Inventory } from './inventory.entity';

describe('InventoryService', () => {
  let service: InventoryService;
  let repository: Repository<Inventory>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InventoryService,
        {
          provide: getRepositoryToken(Inventory),
          useClass: Repository, // Mocked repository class
        },
      ],
    }).compile();

    service = module.get<InventoryService>(InventoryService);
    repository = module.get<Repository<Inventory>>(
      getRepositoryToken(Inventory),
    );
  });

  describe('createInventory', () => {
    it('should create a new inventory item when itemID does not exist', async () => {
      // Arrange the input precondtions
      const inventoryItemDto: InventoryItemDto = {
        itemID: 12345,
        itemName: 'Fancy Dress',
        quantity: 10,
      };
      const inventory = new Inventory();
      inventory.itemID = inventoryItemDto.itemID;
      inventory.itemName = inventoryItemDto.itemName;
      inventory.quantity = inventoryItemDto.quantity;
      // Mocking that itemID does not exist
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(null);
      jest.spyOn(repository, 'create').mockReturnValueOnce(inventory);
      jest.spyOn(repository, 'save').mockResolvedValueOnce(inventory);

      // Act on the inventory service method
      const createdInventory = await service.createInventory(inventoryItemDto);

      // Assert the results of the method calls
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { itemID: inventoryItemDto.itemID },
      });
      expect(repository.create).toHaveBeenCalledWith(inventoryItemDto);
      expect(repository.save).toHaveBeenCalledWith(inventory);
      expect(createdInventory).toEqual(inventory);
    });

    it('should update existing inventory item when itemID exists', async () => {
      // Arrange the input precondtions
      const inventoryItemDto: InventoryItemDto = {
        itemID: 12345,
        itemName: 'Glam gown',
        quantity: 20,
      };
      const existingInventory = new Inventory();
      existingInventory.itemID = inventoryItemDto.itemID;
      existingInventory.itemName = 'Fancy Dress';
      existingInventory.quantity = 5;
      // Mocking that itemID exists
      jest
        .spyOn(repository, 'findOne')
        .mockResolvedValueOnce(existingInventory);
      jest.spyOn(repository, 'save').mockResolvedValueOnce(existingInventory);

      // Act on the inventory service method
      const updatedInventory = await service.createInventory(inventoryItemDto);

      // Assert the results of the method calls
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { itemID: inventoryItemDto.itemID },
      });
      expect(existingInventory.itemName).toBe(inventoryItemDto.itemName);
      expect(existingInventory.quantity).toBe(inventoryItemDto.quantity);
      expect(repository.save).toHaveBeenCalledWith(existingInventory);
      expect(updatedInventory).toEqual(existingInventory);
    });
  });
  describe('getInventory', () => {
    it('should return inventory where id exist', async () => {
      const inventory = new Inventory();
      inventory.itemID = 12345;
      inventory.itemName = 'Fancy Dress';
      inventory.quantity = 5;
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(inventory);
      const result = await service.getInventoryByID(12345);
      expect(result).toEqual(inventory);
    });
    it('should throw error when id does not exist', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(null);
      await expect(service.getInventoryByID(12345)).rejects.toThrowError();
    });
  });
});
