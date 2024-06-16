import { Component } from './base/component';
import { IProductItem } from '../types';
import { ensureElement } from '../utils/utils';
import { settings } from '../utils/constants';

export interface ICardActions {
	onClick: (event: MouseEvent) => void;
}

export interface ICard extends IProductItem {
	index: string;
    buttonState: string;
    
}

export class Card extends Component<ICard> {
    protected _index: HTMLElement;
	protected _title: HTMLElement;
	protected _image: HTMLImageElement;
	protected _category: HTMLElement;
    protected _description?: HTMLElement;
	protected _price: HTMLElement;
	protected _button: HTMLButtonElement;
    protected _buttonState: 'В корзину' | 'Удалить из корзины';


	constructor(container: HTMLElement, actions: ICardActions) {
		super(container);

		this._index = container.querySelector('.basket__item-index');
		this._description = container.querySelector('.card__text');
		this._image = container.querySelector('.card__image');
		this._title = ensureElement<HTMLElement>('.card__title', container);
		this._category = container.querySelector('.card__category');
		this._price = ensureElement<HTMLElement>('.card__price', container);
		this._button = container.querySelector('.card__button');
        this._buttonState = 'В корзину';

		if (actions?.onClick) {
			if (this._button) {
				this._button.addEventListener('click', actions.onClick);
			} else {
				container.addEventListener('click', actions.onClick);
			}
		}
	}

	// Геттер и Сеттер для персонального id товара

    set index(value: string) {
		this.setText(this._index, value);
	}

	get index(): string {
		return this._index.textContent || '';
	}

	set id(value: string) {
		this.container.dataset.id = value;
	}
	get id(): string {
		return this.container.dataset.id || '';
	}

	// Геттер и Сеттер для названия товара

	set title(value: string) {
		this.setText(this._title, value);
	}

	get title(): string {
		return this._title.textContent || '';
	}

	// Сеттер для изображения товара

	set image(value: string) {
		this.setImage(this._image, value, this.title);
	}

	set category(value: string) {
        this.setText(this._category, value);
        this.toggleClass(this._category, settings[value], true);
      }

	get category(): string {
		return this._category?.textContent || '';
	}

    set description(value: string) {
		this.setText(this._description, value);
	}

	set price(value: number) {
		this.setText(this._price, value ? `${value} синапсов` : 'Бесценно');
		if (this._button) {
            this.setDisabled(this._button, !value);
          }        
	}

	get price(): number {
		return +this._price.textContent || 0;
	}

    set buttonState(state: 'В корзину' | 'Удалить из корзины') {
        this._buttonState = state;
        if (this._button) {
          this.setText(this._button, state);
        }
      }
    
      get buttonState(): 'В корзину' | 'Удалить из корзины' {
        return this._buttonState;
      }
    
    

    
}
