import { IOrder, IProductItem, FormErrors, IOrderForm } from '../types';
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
    
    formError: FormErrors = {};
    preview: string | null;


    setCatalog(products: IProductItem[]) {
        this.catalog = this.catalog;
        this.emitChanges('items:changed', { catalog: this.catalog });
    }
    
    setPreview(item: IProductItem) {
        this.preview = item.id;
        this.emitChanges('preview:changed', item);
    }

    /*
    addBasket(product: ProductItem) {
        // метод, с помощью которого товар добавляется в корзину

    }

    deleteBasket(product: IProductItem) {
        //метод удаления товара из корзины

    }

    clearBasket() {
        //ресет корзины при сбросе формы 
    }

    getTotal(): number {
        //считает общую сумму товаров
    }

    getBasketCount(): number {
        //считает кол-во товаров в корзине
    }

    //Устанавливает поля для заказа: контакты, адрес и спобос оплаты

    setOrderField(field: keyof IOrderForm, value: string) {
        this.order[field] = value;

        if (this.validateOrder()) {
            this.events.emit('order:ready', this.order);
        }
    }

     setInfoField(field: keyof IOrderForm, value: string) {
        this.order[field] = value;

        if (this.validateInfo()) {
            this.events.emit('order:ready', this.order);
        }
    }

    //Валидация данных для оформление заказа

    validateOrder() {
        const errors: typeof this.formErrors = {};
        if (!this.order.address) {
            errors.address = 'Необходимо указать адрес'; 
        }
        if (!this.order.payment) {
            errors.payment = 'Необходимо указать cпособ оплаты';
        }
        this.formErrors = errors;
        this.events.emit('formErrors:change', this.formErrors);
        return Object.keys(errors).length === 0;
    }

    validateInfo() {
        const errors: typeof this.formErrors = {};

        if (!this.order.email) {
            errors.email = 'Необходимо указать email';
        }
        if (!this.order.phone) {
            errors.phone = 'Необходимо указать телефон';
        }
        this.formErrors = errors;
        this.events.emit('formErrors:change', this.formErrors);
        return Object.keys(errors).length === 0;

*/
}
