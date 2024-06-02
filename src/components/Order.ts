import { Form } from "./common/Form";
import { IOrderForm } from "../types";
import { IEvents} from "./base/events";
import { ensureElement } from "../utils/utils";

//Класс описывающий поля для оформления заказа (способ оплаты и адрес)
export class Order extends Form<IOrderForm> {
    protected _card: HTMLButtonElement;
    protected _cash: HTMLButtonElement;

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);

        this._card = container.elements.namedItem('card') as HTMLButtonElement;
        this._cash = container.elements.namedItem('cash') as HTMLButtonElement;

        if (this._cash) {
            this._cash.addEventListener('click', () => {
              this._cash.classList.add('button_alt-active')
              this._card.classList.remove('button_alt-active')
              this.onInputChange('payment', 'cash')
            })
          }
          if (this._card) {
            this._card.addEventListener('click', () => {
              this._card.classList.add('button_alt-active')
              this._cash.classList.remove('button_alt-active')
              this.onInputChange('payment', 'card')
            })
          }
        }

        set address(value: string) {
            (this.container.elements.namedItem('address') as HTMLInputElement).value = value;
        }
}

//Класс описывающий поля для оформления заказа (электронная почта и телефон)

export class Info extends Form<IOrderForm> {
    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);
    }

    set phone(value: string) {
        (this.container.elements.namedItem('phone') as HTMLInputElement).value = value;
    }

    set email(value: string) {
        (this.container.elements.namedItem('email') as HTMLInputElement).value = value;
    }
}
