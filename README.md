# Проектная работа "Веб-ларек"

WEB-ларек - это интернет-магазин для веб-разработчиков. Встроены такие функции как: просмотр каталога, добавление товаров в корзину и оформление заказа. 

## Технологии: 
HTML, SCSS, TS, Webpack

## Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/styles/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

## Документация 

### Интерфейсы

#### Интерфейсы IOrder и IOrderForm
Интерфейс является расширением ```IOrderForm```. ```IOrderForm``` - это интерфейс, который отображает модальное окно для заказа товара/товаров. 
- ```payment``` - способ оплаты
- ```email``` - эл. почта заказчика
- ```phone``` - телефон заказчика
- ```address``` - адрес заказчика
- ```total``` - общая стоимость заказа
- ```items``` - массив товаров в заказе

``` Typescript
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
```

#### Интерфейс IOrderResult
Интерфейс результата оформления заказа с персональным ID

``` Typescript
export interface IOrderResult {
    id: string;
}
```
### Тип данных FormErrors
Ошибочная валидации формы 

``` Typescript
export type FormErrors = Partial<Record<keyof IOrder, string>>;
```

### Класс EventEmitter

#### Интерфейс IEvents

``` Typescript
export interface IEvents {
    on<T extends object>(event: EventName, callback: (data: T) => void): void;
    emit<T extends object>(event: string, data?: T): void;
    trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void;
}
```

#### Класс EventEmitter работает с обработчиками событий.
- ```events``` - представляет события, где ключом является имя события ```EventName```, а значением – подписчики ```Subscriber```, которые будут вызваны при возникновении события.

#### Конструктор
Конструктор инициализирует пустой ```events``` для хранения событий.

#### Методы
- ```on``` - данный метод устанавливает обработчик ```callback ```на событие с именем ```eventName```.
- ```off``` - данный метод убирает ```callback``` с события.
- ```emit``` - данный метод вызывает событие с именем ```eventName``` и передает данные ```data``` всем подписчикам этого события.
- ```onAll``` - данный метод устанавливает обработчик ```callback``` на все события.
- ```offAll``` - данный метод удаляет все события и обработчики из ```events```.
- ```trigger``` - данный метод создает "триггер" для события, при определенном контексте ```context``` для инициации .

``` Typescript
export class EventEmitter implements IEvents {
    _events: Map<EventName, Set<Subscriber>>;

    constructor() {
        this._events = new Map<EventName, Set<Subscriber>>();
    }

    /**
     * Установить обработчик на событие
     */
    on<T extends object>(eventName: EventName, callback: (event: T) => void) {
        if (!this._events.has(eventName)) {
            this._events.set(eventName, new Set<Subscriber>());
        }
        this._events.get(eventName)?.add(callback);
    }

    /**
     * Снять обработчик с события
     */
    off(eventName: EventName, callback: Subscriber) {
        if (this._events.has(eventName)) {
            this._events.get(eventName)!.delete(callback);
            if (this._events.get(eventName)?.size === 0) {
                this._events.delete(eventName);
            }
        }
    }

    /**
     * Инициировать событие с данными
     */
    emit<T extends object>(eventName: string, data?: T) {
        this._events.forEach((subscribers, name) => {
            if (name instanceof RegExp && name.test(eventName) || name === eventName) {
                subscribers.forEach(callback => callback(data));
            }
        });
    }

    /**
     * Слушать все события
     */
    onAll(callback: (event: EmitterEvent) => void) {
        this.on("*", callback);
    }

    /**
     * Сбросить все обработчики
     */
    offAll() {
        this._events = new Map<string, Set<Subscriber>>();
    }

    /**
     * Сделать коллбек триггер, генерирующий событие при вызове
     */
    trigger<T extends object>(eventName: string, context?: Partial<T>) {
        return (event: object = {}) => {
            this.emit(eventName, {
                ...(event || {}),
                ...(context || {})
            });
        };
    }
}
```

### Класс Api
Класс для работы с API приложения, выполняющий HTTP запросы

- ```baseUrl``` - получает базовый url
- ```options``` - запрос

#### Конструктор
Конструктор принимает базовый URL и объект параметров запроса (необязательный параметр)

#### Методы
- ```handleResponse``` - обрабатывает ответ от сервера, если запрос успешен, возвращает результат в формате JSON, если нет - возвращает данные об ошибке.
- ```GET``` - GET-запрос к указанному URI и возвращает Promise с данными в формате JSON.
- ```POST``` - POST-запрос указанному URI с переданными данными (в формате объекта)

``` Typescript
export class Api {
    readonly baseUrl: string;
    protected options: RequestInit;

    constructor(baseUrl: string, options: RequestInit = {}) {
        this.baseUrl = baseUrl;
        this.options = {
            headers: {
                'Content-Type': 'application/json',
                ...(options.headers as object ?? {})
            }
        };
    }

    protected handleResponse(response: Response): Promise<object> {
        if (response.ok) return response.json();
        else return response.json()
            .then(data => Promise.reject(data.error ?? response.statusText));
    }

    get(uri: string) {
        return fetch(this.baseUrl + uri, {
            ...this.options,
            method: 'GET'
        }).then(this.handleResponse);
    }

    post(uri: string, data: object, method: ApiPostMethods = 'POST') {
        return fetch(this.baseUrl + uri, {
            ...this.options,
            method,
            body: JSON.stringify(data)
        }).then(this.handleResponse);
    }
}
```
### Класс WebLarekApi

#### Интерфейс IWebLarekApi

``` Typescript
export interface IWebLarekApi {
    getProducts: () => Promise<IProductItem[]>;
    getProductItem: (id: string) => Promise<IProductItem>;
    getOrder: (order: IOrder) => Promise<IOrderResult>;
}
```

#### WebLarekApi - класс расширяет родительский класс Api и реализует интерфейс IWebLarekApi. Он включает в себя методы для получения информации о продуктах, и размещения заказа.

#### Конструктор
В конструкторе этого класса вызывается конструктор класса Api, передавая ему ```baseUrl``` и ```options```, и затем устанавливается свойство ```cdn``` (это url) с переданным значением.

#### Методы
- ``` getProducts```  - данный метод отправляет GET-запрос на эндпоинт /product, который возвращает список продуктов с сервера.
- ``` getOrder```  - данный метод отправляет POST-запрос на эндпоинт /order, передавая объект order.

``` Typescript
export class WebLarekApi extends Api implements IWebLarekApi {
    readonly cdn: string;

    constructor(cdn: string, baseUrl: string, options?: RequestInit) {
		super(baseUrl, options);
		
        this.cdn = cdn;
	}

    getProducts(): Promise<IProductItem[]> {
        return this.get('/product').then((data: ApiListResponse<IProductItem>) =>
            data.items.map((item) => ({
                ...item,
                image: this.cdn + item.image
            }))
        );
    }

    getOrder(order: IOrder): Promise<IOrderResult> {
		return this.post('/order', order).then((data: IOrderResult) => data);
	}

}
```

### Класс AppState

#### Интерфейс IAppState

``` Typescript
export interface IAppState {
    catalog: IProductItem[];
    order: IOrder | null;
    basket: IProductItem[];
    preview: string | null;
}
```
- ```catalog``` - элементы(товары) из каталога
- ```order``` - данные формы заказа
- ```basket``` - элементы каталога, добавленные в корзину
- ```preview``` - превью товара

#### Класс AppState - Класс, описывающий состояние приложения, расширяется Model<T> с интерфейсом IAppState

#### Методы
- ```setCatalog``` - выводит каталог на страницу
- ```setPreview``` - метод, отображающий товар
- ```addBasket``` - метод, с помощью которого товар добавляется в корзину
- ```deleteBasket``` - метод удаления товара из корзины
- ```clearBasket``` - ресет корзины при сбросе формы 
- ```getTotal``` - считает общую сумму товаров
- ```getBasketCount``` - считает кол-во товаров в корзине
- ```setOrderField``` - установка полей для оформления заказа(способ оплаты, адрес заказчика)
- ```setInfoField``` - установка полей для оформления заказа(номер, почта)
- ```validateOrder``` - валидация данных при заказе (способ оплаты, адрес заказчика)
-``` validateInfo``` - валидация данных о заказчике (номер, почта)

``` Typescript
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
```

### Класс ```Model```
Базовая модель, чтобы можно было отличить ее от простых объектов с данными.
Это абстрактный класс, который является шаблоном для создания новых моделей данных.

#### Конструктор
С помощью метода ```Object.assign``` копирует данные из объекта ```data``` и передает их в новый.

#### Методы
Метод ```emitChanges``` сообщает об изменении данных в модели, используя ```EventEmitter```.

``` Typescript
export abstract class Model<T> {
	constructor(data: Partial<T>, protected events: IEvents) {
		Object.assign(this, data);
	}

	emitChanges(event: string, payload?: object) {
		this.events.emit(event, payload ?? {});
	}
}
```

### Функция isModel
Данная функция проверяет является ли объект моделью.
```obj``` - объект для проверки.

``` Typescript

export const isModel = (obj: unknown): obj is Model<any> => {
    return obj instanceof Model;
}
```

### Класс ```Component```
Абстрактный класс для создания и отображения компонентов

#### Конструктор
Принимает ```container``` с типом ```HTMLElement```

#### Методы
- ```toggleClass``` - данный метод переключает класс у указанного элемента.
```element``` - элемент HTML, на котором нужно переключить класс.
```className``` - имя класса CSS для переключения.
```force``` - необязательный аргумент, принудительно добавляет или удаляет класс.

- ```setText``` - данный метод устанавливает текстовое соденжимое элемента.
```element``` - элемент HTML, у которого будет обновляться текстовое соденжимое.
```value``` - новое текстовое содержимое элемента.

- ```setDisabled``` - данный метод управляет состоянием блокировки элемента HTML. 
```element``` - элемент HTML, у которого определяется состояние блокировки.
```state``` - изменяет состояние блокировки. Если state является true, то устанавливает атрибут disabled, если false - удаляет его.

- ```setHidden``` - данный метод скрывает элемент.
```element``` - элемент HTML, который будет скрыт с помощью свойства ```display: none```.

- ```setVisible``` - данный метод показывает скрытый элемент, удаляя свойство ```display```.
```element``` - элемент HTML, который будет отображаться.

- ```setImage``` - данный метод устанавливает изображение.
```element``` - элемент HTML, у которого будет устанавливаться изображение.
```src``` - источник (ссылка) картинки.
```alt``` - необязательный аргумент, задает альтернативный текст, если изображение не отображается.

- ```render``` - данный метод возвращает корневой HTML-элемент компонента.
```data``` - данные, которые обновляются перед render.



``` Typescript
export abstract class Component<T> {
    protected constructor(protected readonly container: HTMLElement) {
    }

    // Переключить класс
    toggleClass(element: HTMLElement, className: string, force?: boolean): void {
        element.classList.toggle(className, force);
    }

    // Установить текстовое содержимое
    protected setText(element: HTMLElement, value: unknown): void {
        if (element) {
            element.textContent = String(value);
        }
    }

    // Сменить статус блокировки
    setDisabled(element: HTMLElement, state: boolean): void {
        if (element) {
            if (state) element.setAttribute('disabled', 'disabled');
            else element.removeAttribute('disabled');
        }
    }

    // Скрыть
    protected setHidden(element: HTMLElement): void {
        element.style.display = 'none';
    }

    // Показать
    protected setVisible(element: HTMLElement): void {
        element.style.removeProperty('display');
    }

    // Установить изображение с алтернативным текстом
    protected setImage(element: HTMLImageElement, src: string, alt?: string): void {
        if (element) {
            element.src = src;
            if (alt) {
                element.alt = alt;
            }
        }
    }

    // Вернуть корневой DOM-элемент
    render(data?: Partial<T>): HTMLElement {
        Object.assign(this as object, data ?? {});
        return this.container;
    }
}
```

### Класс ProductItem

#### Интерфейс IProductItem
Интерфейс, описывающий товар в каталоге.
- ```id``` - персональный ID товара
- ```title``` - название товара
- ```description``` - описание товара
- ```image``` - изображение товара
- ```price``` - стоимость товара
- ```category``` - категория товара

``` Typescript
export interface IProductItem {
    id: string;
    title: string;
    description: string;
    image: string;
    price: number | null;
    category: string;
}
```

#### ProductItem - Класс, основанный на Model<T>, отображает товар

``` Typescript
export class ProductItem extends Model<IProductItem> {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number | null;
}
```

### Класс Page

#### Интерфейс IPage
Интерфейс для отображения страницы 
- ```counter``` - счетчик товаров 
- ```catalog``` - массив товаров на странице
- ```locked``` - блокировка прокрутки страницы

``` Typescript
export interface IPage {
    counter: number;
    catalog: HTMLElement[];
    locked: boolean;
}
```

#### Page - Класс представления, отображает элементы на странице 

- ```counter``` - защищенное свойство, хранит количество товаров в корзине.
- ```catalog``` - защищенное свойство, каталог товаров на странице
- ```wrapper``` - защищенное свойство, разметка страницы
- ```basket``` - защищенное свойство, кнопка корзины

#### Конструктор
Принимает ```container``` с типом ```HTMLElement```  и объект событий ```IEvents```.
У корзины имеетя обработчик события ("click), вызывает ```basket:open```.

#### Методы
- ```set counter``` - сеттер для свойства ```counter```, определяет текстовое содержимое у счетчика.
- ```set catalog``` - сеттер для свойства ```catalog```, устанавливает каталог товаров. 
- ```set locked``` - сеттер для свойства ```locked```, добавляет или удаляет класс page__wrapper_locked у контейнера, то есть ставит или убирает блок с прокрутки страницы.

``` Typescript
export class Page extends Component<IPage> {
    protected _counter: HTMLElement;
    protected _catalog: HTMLElement;
    protected _wrapper: HTMLElement;
    protected _basket: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this._counter = ensureElement<HTMLElement>('.header__basket-counter');
        this._catalog = ensureElement<HTMLElement>('.gallery');
        this._wrapper = ensureElement<HTMLElement>('.page__wrapper');
        this._basket = ensureElement<HTMLElement>('.header__basket');

        this._basket.addEventListener('click', () => {
            this.events.emit('basket:open');
        });
    }

    set counter(value: number) {
        this.setText(this._counter, String(value));
    }

    set catalog(items: HTMLElement[]) {
        this._catalog.replaceChildren(...items);
    }

    set locked(value: boolean) {
        if (value) {
            this._wrapper.classList.add('page__wrapper_locked');
        } else {
            this._wrapper.classList.remove('page__wrapper_locked');
        }
    }
}
``` 
### Класс Form

#### Интерфейс IFormState
- valid - валидация формы
- errors - текст ошибки при валидации формы 

``` Typescript
interface IFormState {
    valid: boolean;
    errors: string[];
}
```

#### Form<T> - Класс для создания формы заполнения и её валидация
- ```submit``` - отправка формы 
- ```errors``` - ошибка валидации формы при заполнении

#### Конструктор
Принимает ```container``` с типом ```HTMLElement```  и объект событий ```IEvents```.
В конструкторе описаны инициализация элементов формы, установка обработчиков событий на введенные данные и отправку формы, и подписка на изменения значений в полях.

#### Методы
- ```onInputChange``` - данный метод вызывается при изменении значений в полях формы.
- ```set valid``` - данный метод устанавливает валдиацию в полях формы.
- ```set errors``` - данный метод устанавливает текстовое содержимое, сообщающее об ошибке  в полях формы
- ```render``` - рендер, обновляет состояние валидоности формы.


``` Typescript
export class Form<T> extends Component<IFormState> {
    protected _submit: HTMLButtonElement;
    protected _errors: HTMLElement;

    constructor(protected container: HTMLFormElement, protected events: IEvents) {
        super(container);

        this._submit = ensureElement<HTMLButtonElement>('button[type=submit]', this.container);
        this._errors = ensureElement<HTMLElement>('.form__errors', this.container);

        this.container.addEventListener('input', (e: Event) => {
            const target = e.target as HTMLInputElement;
            const field = target.name as keyof T;
            const value = target.value;
            this.onInputChange(field, value);
          });

        this.container.addEventListener('submit', (e: Event) => {
            e.preventDefault();
            this.events.emit(`${this.container.name}:submit`);
        });
    }

    protected onInputChange(field: keyof T, value: string) {
        this.events.emit(`${this.container.name}.${String(field)}:change`, {
            field,
            value
        });
    }

    set valid(value: boolean) {
        this._submit.disabled = !value;
    }

    set errors(value: string) {
        this.setText(this._errors, value);
    }

    render(state: Partial<T> & IFormState) {
        const {valid, errors, ...inputs} = state;
        super.render({valid, errors});
        Object.assign(this, inputs);
        return this.container;

    }
}
```

### Класс Card

#### Интерфейсы ICard и ICardActions

- ``` onClick```  - обработчик событий, работающий с карточкой товара

``` Typescript
interface ICardActions {
    onClick: (event: MouseEvent) => void;
}
```
- ```selected``` - указывает, был выбран товар в корзину или нет

``` Typescript
export interface ICard<T> {
    id: string;
    title: string;
    description?: string;
    image: string;
    price: number | null;
    category: string;
    selected: boolean;
}
```

#### Card<T> - Класс описывает карточку товара

- ```title``` - защищенное свойство, название товара 
- ```image``` - защищенное свойство, изображение товара
- ```description``` - защищенное свойство, описание товара (опционально)
- ```category``` - защищенное свойство, категория товара
- ```price``` - защищенное свойство, стоимость товара
- ```button``` - элемент кнопки на карточке товара

#### Конструктор
Конструктор принимает имя блока ```blockName``` для определения элементов карточки, контейнер ```container``` и опциональный объект ```actions```, в котором содержится обработчик событий из ```ICardActions```.
Если передан обработчик ```onClick```, он добавляется к кнопке карточки.

#### Методы
- set/get id - Геттер и Сеттер для персонального id товара
- set/get title - Геттер и Сеттер для названия товара
- set image - Сеттер для изображения товара
- set description - Сеттер для описания товара
- set/get category - Сеттер и геттер категории товара
- set/get price - Сеттер и геттер категории товара

``` Typescript
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
```

### Класс Basket

#### Интерфейс IBasket
Интерфейс корзины товаров
- ```items``` - массив элементов с товаром
- ```total``` - общая стоимость товаров

``` Typescript
export interface IBasket {
	items: HTMLElement[];
	total: number;
}
``` 
#### Basket - Класс описывающий корзину товаров

- ```list```  - защищенное свойство, хранит список товаров в корзине.
- ``` total```  - защищенное свойство, хранит общую стоимость.
- ``` button```  - защищенное свойство, хранит разметку кнопки оформления заказа.

#### Конструктор
Принимает ```container``` с типом ```HTMLElement```  и объект событий ```IEvents```.
элемент списка товаров ```list``` получает ссылку на соответствующий элемент DOM с классом ```basket__list```.
Находится элемент ``` total``` в пределах контейнера и присваивает элемент с классом ```basket__price```.
Элемент ``` button``` получает ссылку на соотвестующий элемент DOM с классом ```basket__button```.

Если кнопка найдена, устанавливается слушатель событий ```click```, при нажатии срабатывает событие ```order:open```.

#### Методы 
- ```set items``` - Сеттер устанавливает элементы корзины. Если массив ```items``` содержит элементы, они заменяются в элементе списка ```list```, если нет - отображается текст "Корзина пуста".
-  ```set total``` - Сеттер вызывает метод setText и устанавливает общую стоимость товаров в корзине.

``` Typescript
export class Basket extends Component<IBasket> {
	protected _list: HTMLElement;
	protected _total: HTMLElement;
	protected _button: HTMLButtonElement;

	constructor(container: HTMLElement, protected events: EventEmitter) {
		super(container);

		this._list = ensureElement<HTMLElement>('.basket__list', this.container);
		this._total = this.container.querySelector('.basket__price');
		this._button = this.container.querySelector('.basket__button');

		if (this._button) {
			this._button.addEventListener('click', () => {
				events.emit('order:open');
			});
		}

		this.items = [];
	}
	set items(items: HTMLElement[]) {
		if (items.length) {
			this._list.replaceChildren(...items);
		} else {
			this._list.replaceChildren(
				createElement<HTMLParagraphElement>('p', {
					textContent: 'Корзина пуста',
				})
			);
		}
	}

    set total(total: number) {
        this.setText(this._total, `${total} синапсов`);
    }
}
``` 

### Класс Modal

#### Интерфейс IModalData
Интерфейс для модального окна
- ```content``` - контент модального окна

``` Typescript
interface IModalData {
	content: HTMLElement;
}
```

#### Modal - Класс отображающий модальное окно приложения
- ```closeButton``` - защищенное свойство, элемент кнопки для закрытия модального окна
- ```content``` - защищенное свойство, контент модального окна

#### Конструктор
Принимает ```container``` с типом ```HTMLElement```  и объект событий ```IEvents```.
У ```closeButton``` имеется слушатель событий ```click```. При клике на кнопку закрытия модального окна или при клике в области модального окна срабатывает вызов метода ```close```, а при клике внутри контента модального окна событие не всплывает.

#### Методы 
- ```set content```- данный метод устанавливает содержимое модального окна, заменяет его на новое
- ```open()``` - данный метод позволяет открыть модальное окно, дабавляет класс ```modal_active``` к контейнеру модального окна и запускает событие ```modal:open```.
- ```close()``` - данный метод закрывает модальное окно, убирает класс ```modal_active``` из контейнера модального окна, тем самым очищает содержимое и запускает событие ```modal:close```.
- ```render``` - данный метод отрисовывает модальное окно, вызывая метод ```render ``` родительского класса Component<T>, открывая модальное окно и возвращая его контейнер. 

``` Typescript
export class Modal extends Component<IModalData> {
	protected _closeButton: HTMLButtonElement;
	protected _content: HTMLElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this._closeButton = ensureElement<HTMLButtonElement>(
			'.modal__close',
			container
		);
		this._content = ensureElement<HTMLElement>('.modal__content', container);

		this._closeButton.addEventListener('click', this.close.bind(this));
		this.container.addEventListener('click', this.close.bind(this));
		this._content.addEventListener('click', (event) => event.stopPropagation());
	}

	set content(value: HTMLElement) {
		this._content.replaceChildren(value);
	}

    open() {
        this.container.classList.add('modal_active');
        this.events.emit('modal:open');
      }

      close() {
        this.container.classList.remove('modal_active');
        this.content = null;
        this.events.emit('modal:close');
      }

	render(data: IModalData): HTMLElement {
		super.render(data);
		this.open();
		return this.container;
	}
}
```
### Классы Order и Info

#### Order - Класс описывающий поля для оформления заказа (способ оплаты и адрес)

- card - защищенное свойство, выбор оплаты картой
- cash - защищенное свойство, выбор оплаты наличными

#### Конструктор
Принимает ```container``` с типом ```HTMLElement```  и объект событий ```IEvents```. 
При обработке нажатия кнопки, наличие класса ```button_alt-active``` изменяется у ```card``` или ```cash```, и вызывается метод ```onInputChange``` из родительского класса ```Form<T>```, уведомляя об изменении значения.

#### Методы
- ```set address``` - данный сеттер устанавливает значение поля адреса в форме.

``` Typescript
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
```

#### Info - Класс описывающий поля для оформления заказа (электронная почта и телефон)

#### Конструктор
Принимает ```container``` с типом ```HTMLElement```  и объект событий ```IEvents```. 

#### Методы
- set phone - данный сетер устанавливает значение номера телефона 
- set email - данный сетер устанавливает значение электронной почты

``` Typescript
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
```

### Класс Success

#### Интерфейсы ISuccess и ISuccessActions
- ```total``` - общая стоимость заказа

``` Typescript
interface ISuccess {
    total: number;
}
```

- ```onClick``` - обработчик событий, позволяет закрыть окно об успешном оформлении заказа

``` Typescript
interface ISuccessActions {
    onClick: (event: MouseEvent) => void;
}
```

#### Success - Класс отображающий успешное оформление заказа
- ```total``` - общая стоимость заказа
- ```close``` - кнопка закрытия окна 

#### Конструктор
Конструктор принимает контейнер с типом HTMLElement и объект ```actions```, содержащий метод ```onClick``` из интерфейса ```ISuccessActions```. В конструкторе устанавливается обработчик событий для элемента ```close```.

#### Методы 
- ```set total``` - данный метод устанавливает текстовое содержимое элементу ```total```, отображает информацию о списании суммы за заказ.


``` Typescript
export class Success extends Component<ISuccess> {
    protected _total: HTMLElement;
    protected _close: HTMLElement;

    constructor(container: HTMLElement, actions: ISuccessActions) {
        super(container);

        this._close = ensureElement<HTMLElement>('.order-success__close', this.container);
        this._total = ensureElement<HTMLElement>('.order-success__description', this.container)


        if (actions?.onClick) {
            this._close.addEventListener('click', actions.onClick);
        }
    }
    set total(value: string) {
        this.setText(this._total, `Списано ${value} синапсов`)
      }
}
```