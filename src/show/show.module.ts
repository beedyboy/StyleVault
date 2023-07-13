import { Module } from '@nestjs/common';
import { ShowService } from './show.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Show } from 'src/entities/show.entity';
import { ShowController } from './show.controller';
import { InventoryModule } from 'src/inventory/inventory.module';

@Module({
  imports: [TypeOrmModule.forFeature([Show]), InventoryModule],
  providers: [ShowService],
  controllers: [ShowController],
})
export class ShowModule {}
