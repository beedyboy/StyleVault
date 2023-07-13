import { ShowService } from './show.service';
import { Show } from '../entities/show.entity';
import { ISoldItem } from 'src/interfaces/show.interface';
export declare class ShowController {
    private readonly showService;
    constructor(showService: ShowService);
    buyItem(showID: number, itemID: number): Promise<Show>;
    findSoldItemsByShow(show_ID: number, item_id?: number): Promise<ISoldItem | ISoldItem[]>;
}
