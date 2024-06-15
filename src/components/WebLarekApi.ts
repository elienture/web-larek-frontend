import { Api, ApiListResponse } from './base/api';
import { IOrder, IProductItem, IOrderResult } from '../types';

export interface IWebLarekApi {
    getProducts: () => Promise<IProductItem[]>;
    getOrder: (order: IOrder) => Promise<IOrderResult>;
}

export class WebLarekApi extends Api implements IWebLarekApi {
    readonly cdn: string;

    constructor(cdn: string, baseUrl: string, options?: RequestInit) {
        super(baseUrl, options);
        
        this.cdn = cdn;
    }

    getProducts(): Promise<IProductItem[]> {
		return this.get('/product').then((data: ApiListResponse<IProductItem>) =>
			data.items.map((item) => ({
				...item,
				image: this.cdn + item.image,
			}))
		);
	}

    getOrder(order: IOrder): Promise<IOrderResult> {
		return this.post('/order', order).then((data: IOrderResult) => data);
	}
}