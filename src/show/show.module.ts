import { Module } from '@nestjs/common';
import { ShowService } from './show.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Show } from 'src/entities/show.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Show])],
  providers: [ShowService],
})
export class ShowModule {}
