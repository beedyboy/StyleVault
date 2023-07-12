import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Inventory } from './inventory.entity';

@Entity()
export class Show {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  showID: number;

  @ManyToOne(() => Inventory, (inventory) => inventory.shows)
  inventory: Inventory;

  @Column()
  quantitySold: number;
}
