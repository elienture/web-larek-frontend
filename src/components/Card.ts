import {Component} from "./base/component";
import { IProductItem } from '../types';
import { ensureElement, createElement } from '../utils/utils';

interface ICardActions {
    onClick: (event: MouseEvent) => void;
}

export interface ICard<T> {
    id: string;
    title: string;
    description?: string;
    image: string;
    price: number | null;
    category: string;
    selected: boolean;
}

export class Card<T> extends Component<ICard<T>> {
    protected _title: HTMLElement;
    protected _image: HTMLImageElement;
    protected _description?: HTMLElement;
    protected _category: HTMLElement;
    protected _price: HTMLElement;
    protected _button: HTMLButtonElement;

    constructor(protected blockName: string, container: HTMLElement, actions?: ICardActions) {
        super(container);

        this._title = ensureElement<HTMLElement>(`.${blockName}__title`, container);
        this._image = ensureElement<HTMLImageElement>(`.${blockName}__image`, container);
        this._button = container.querySelector(`.${blockName}__button`);
        this._description = container.querySelector(`.${blockName}__text`);
        this._price = container.querySelector(`.${blockName}__price`);
        this._category = container.querySelector(`.${blockName}__category`);

        if (actions?.onClick) {
            if (this._button) {
                this._button.addEventListener('click', actions.onClick);
            } else {
                container.addEventListener('click', actions.onClick);
            }
        }
    }

    // Геттер и Сеттер для персонального id товара

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
        this.setImage(this._image, value, this.title)
    }

     // Сеттер для описания товара

    set description(value: string) {
        this.setText(this._description, value);
    }
//Сеттер и геттер категории товара
    //get category(): string

    //set category(value: string) 

//Сеттер и геттер стоимости товара    

    //get price(): number

    //set price(value: number)
}
