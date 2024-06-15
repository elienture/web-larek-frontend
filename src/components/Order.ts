import { Form } from './common/Form';
import { IOrder } from '../types';
import { IEvents } from './base/events';
import { ensureAllElements } from '../utils/utils';

//Класс описывающий поля для оформления заказа (способ оплаты и адрес)
export class Order extends Form<IOrder> {
	protected _payment: HTMLButtonElement[];

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

		this._payment = ensureAllElements(`.button_alt`, this.container);

		this._payment.forEach((button) => {
			button.addEventListener('click', () => {
				this.payment = button.name;
				this.onInputChange(`payment`, button.name);
			});
		});
	}
	// устанавливает класс активности на кнопку (active)
	set payment(name: string) {
		this._payment.forEach((button) => {
			this.toggleClass(button, 'button_alt-active', button.name === name);
		});
	}
	// устанавливает значение поля адрес
	set address(value: string) {
		(this.container.elements.namedItem('address') as HTMLInputElement).value =
			value;
	}
}

//Класс описывающий поля для оформления заказа (электронная почта и телефон)

export class Contact extends Form<IOrder> {
	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);
	}

	set phone(value: string) {
		(this.container.elements.namedItem('phone') as HTMLInputElement).value =
			value;
	}

	set email(value: string) {
		(this.container.elements.namedItem('email') as HTMLInputElement).value =
			value;
	}
}
