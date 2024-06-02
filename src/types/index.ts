
/* Интерфейс, описывающий товар в каталоге*/
export interface IProductItem {
    id: string;
    title: string;
    description: string;
    image: string;
    price: number | null;
    category: string;
}

/* Интерфейс, который отображает модальное окно для заказа товара/товаров */
export interface IOrderForm {
    payment: string;
    email: string;
    phone: string;
    address: string;
    total: number;
}

export interface IOrder extends IOrderForm {
    items: string[];
}

export interface IOrderResult {
    id: string;
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