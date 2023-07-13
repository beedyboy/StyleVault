import {
  Controller,
  Post,
  Param,
  NotFoundException,
  BadRequestException,
  Get,
} from '@nestjs/common';
import { ShowService } from './show.service';
import { Show } from '../entities/show.entity';
import { ISoldItem } from 'src/interfaces/show.interface';

@Controller('show')
export class ShowController {
  constructor(private readonly showService: ShowService) {}

  @Post(':showID/buy_item/:itemID')
  async buyItem(
    @Param('showID') showID: number,
    @Param('itemID') itemID: number,
  ): Promise<Show> {
    try {
      const show = await this.showService.buyItem(showID, itemID);
      return show;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('Show or inventory item not found');
      }
      if (error instanceof BadRequestException) {
        throw new BadRequestException('Insufficient inventory for the item');
      }
      throw new BadRequestException('Failed to process the request');
    }
  }
  @Get('/:show_ID/sold_items/:item_id?')
  async findSoldItemsByShow(
    @Param('show_ID') show_ID: number,
    @Param('item_id') item_id?: number,
  ): Promise<ISoldItem | ISoldItem[]> {
    const soldItems = await this.showService.findSoldItemsByShow(
      show_ID,
      item_id,
    );
    return soldItems;
  }
}
