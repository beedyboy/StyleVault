import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Inventory } from './inventory.entity';

@Entity()
export class Show {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  showID: number;

  @Column()
  quantitySold: number;

  @OneToOne(() => Inventory)
  @JoinColumn()
  inventory: Inventory;
}
