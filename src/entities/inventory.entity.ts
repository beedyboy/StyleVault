import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Show } from './show.entity';

@Entity()
export class Inventory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Index({ unique: true })
  itemID: number;

  @Column()
  itemName: string;

  @Column()
  quantity: number;

  @OneToMany(() => Show, (show) => show.inventory)
  shows: Show[];

  @CreateDateColumn() createdAt!: Date;

  @UpdateDateColumn() updatedAt!: Date;
}
