import { Controller, Post, Param, NotFoundException } from '@nestjs/common';
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
    const show = await this.showService.buyItem(showID, itemID);

    if (!show) {
      throw new NotFoundException('Show or inventory item not found');
    }

    return show;
  }
}
