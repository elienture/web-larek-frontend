
/* Интерфейс, описывающий товар в каталоге*/
export interface IProductItem {
    id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number | null;
}

/* Интерфейс, который отображает модальное окно для заказа товара/товаров */
export interface IOrderForm {
	address: string;
	payment: string;
}

export interface IContactForm {
	phone: string;
	email: string;
}

export interface IOrder extends IOrderForm, IContactForm {
    items: string[];
    total: number;
}

export interface IOrderResult {
    id: string;
    total: number;
}

/* Ошибочная валидации формы */
export type FormErrors = Partial<Record<keyof IOrder, string>>;


/* Интерфейс, содержащий данные приложения */
    export interface IAppState {
        catalog: IProductItem[];
        basket: IProductItem[];
        order: IOrder;
        prewiew: string | null;
    }