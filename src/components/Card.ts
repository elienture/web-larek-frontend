import { Component } from './base/component';
import { IProductItem } from '../types';
import { ensureElement, createElement } from '../utils/utils';
import { settings } from '../utils/constants';

export interface ICardActions {
	onClick: (event: MouseEvent) => void;
}

export interface ICard extends IProductItem {
	index: string;
}

export class Card extends Component<ICard> {
    protected _index: HTMLElement;
	protected _title: HTMLElement;
	protected _image: HTMLImageElement;
	protected _category: HTMLElement;
    protected _description?: HTMLElement;
	protected _price: HTMLElement;
	protected _button: HTMLButtonElement;

	constructor(container: HTMLElement, actions: ICardActions) {
		super(container);

		this._index = container.querySelector('.basket__item-index');
		this._description = container.querySelector('.card__text');
		this._image = container.querySelector('.card__image');
		this._title = ensureElement<HTMLElement>('.card__title', container);
		this._category = container.querySelector('.card__category');
		this._price = ensureElement<HTMLElement>('.card__price', container);
		this._button = container.querySelector('.card__button');

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
		this._index.textContent = value;
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
		this._category.classList.add(settings[value]);
	}

	get category(): string {
		return this._category?.textContent || '';
	}

    set description(value: string) {
		this._description.textContent = value;
	}


	set price(value: number) {
		this.setText(this._price, value ? `${value} синапсов` : 'Бесценно');
		if (this._button && !value) {
			this._button.disabled = true;
		}
	}

	get price(): number {
		return +this._price.textContent || 0;
	}

    set button(value: string) {
		if (this._button) {
			this._button.textContent = value;
		}
	}
}
