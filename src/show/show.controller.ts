import {
  Controller,
  Post,
  Param,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { ShowService } from './show.service';
import { Show } from '../entities/show.entity';

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
}
