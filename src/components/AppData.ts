import { IOrder, IProductItem, FormErrors, IOrderForm, IContactForm } from '../types';
import { Model } from './base/model';
import { IAppState } from '../types';


// Класс товара
export class ProductItem extends Model<IProductItem> {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
    selected: boolean;
}

export type CatalogChangeEvent = {
    catalog: ProductItem[];
  }

// Класс, описывающий состояние приложения

export class AppState extends Model<IAppState> {
    catalog: IProductItem[];
	basket: IProductItem[] = [];
	order: IOrder = {
		total: 0,
		items: [],
		phone: '',
		email: '',
		payment: '',
		address: '',
	};
	
	formErrors: FormErrors = {};
	preview: string | null;


    setCatalog(items: IProductItem[]) {
        this.catalog = items.map(item => new ProductItem(item, this.events));
        this.emitChanges('items:changed', { catalog: this.catalog });
      }
    
    setPreview(item: IProductItem) {
        this.preview = item.id;
        this.emitChanges('preview:changed', item);
    }

    basketUpdate() {
		this.events.emit('catalog:change', {
			products: this.basket,
		});
		this.events.emit('basket:change', {
			products: this.basket,
		});
	}

    addBasket(product: IProductItem) {
		this.basket.push(product);
		this.basketUpdate();
	}

	deleteBasket(product: IProductItem) {
		this.basket = this.basket.filter((item) => item.id !== product.id);
		this.basketUpdate();
	}

	clearBasket() {
		this.basket = [];
		this.basketUpdate();
	}

  
    getBasketCount(): number {
        return this.basket.length;
    }

    getTotal(): number {
        return this.basket.reduce((total, item) => total + item.price, 0);
    }

    getBasketItems() {
        this.order.items = this.basket.map(item => item.id)
    }


    setOrderField(field: keyof IOrderForm, value: string) {
		this.order[field] = value;
		if (this.validateOrder()) {
		}
	}

	setContactField(field: keyof IContactForm, value: string) {
		this.order[field] = value;

		if (this.validateContact()) {
		}
	}

	validateOrder() {
		const errors: typeof this.formErrors = {};
		if (!this.order.payment) {
			errors.payment = 'Необходимо указать cпособ оплаты';
		}
		if (!this.order.address) {
			errors.address = 'Необходимо указать адрес доставки';
		}
		this.formErrors = errors;
		this.events.emit('orderformErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}

	validateContact() {
		const errors: typeof this.formErrors = {};
		if (!this.order.email) {
			errors.email = 'Необходимо указать email';
		}
		if (!this.order.phone) {
			errors.phone = 'Необходимо указать телефон';
		}
		this.formErrors = errors;
		this.events.emit('contactsformErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}


    resetOrder() {
        this.order = {
          items: [],
          total: null,
          address: '',
          email: '',
          phone: '',
          payment: ''
        };
      }
    }
