import { IProductItem } from '../types';
import { createElement, ensureElement } from '../utils/utils';
import { Component } from './base/component';
import { EventEmitter, IEvents } from './base/events';
import { ICard, ICardActions } from './Card';

export interface IBasket {
    items: HTMLElement[];
    total: number;
}


export class Basket extends Component<IBasket> {
    protected _list: HTMLElement;            
    protected _total: HTMLElement;          
    protected _button: HTMLButtonElement;   

    constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this._list = ensureElement<HTMLElement>('.basket__list', this.container);
		this._total = this.container.querySelector('.basket__price');
		this._button = this.container.querySelector('.button');

		if (this._button) {
			this._button.addEventListener('click', () => {
				events.emit('order:open');
			});
		}

		this.items = [];
	}

	toggleButton(state: boolean) {
        this.setDisabled(this._button, state);
    } 

	set items(items: HTMLElement[]) {
		if (items.length) {
		  this._list.replaceChildren(...items);
		  this.toggleButton(false); 
		} else {
		  this._list.replaceChildren(
			createElement<HTMLParagraphElement>('p', {
			  textContent: 'Корзина пуста'
			})
		  );
		  this.toggleButton(true); 
		}
	  }


	set total(total: number) {
		this.setText(this._total, `${total} синапсов`);
	}

    
}

