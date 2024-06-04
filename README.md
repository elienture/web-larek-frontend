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
- src/scss/styles.scss — корневой файл стилей
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

#### Интерфейс IOrderResult
Интерфейс результата оформления заказа с персональным ID
- ```id``` - персональный id

### Тип данных FormErrors
Ошибочная валидации формы 

``` Typescript
export type FormErrors = Partial<Record<keyof IOrder, string>>;
```

### Класс EventEmitter
Класс EventEmitter создан для работы с обработчика событий, реализует интерфейс IEvents, в котором описаны методы ```on```, ```emit``` и ```trigger```.

- ```events``` - представляет события, где ключом является имя события ```EventName```, а значением – подписчики ```Subscriber```, которые будут вызваны при возникновении события.

#### Конструктор
Конструктор инициализирует пустой ```events``` для хранения событий.

#### Методы
- ```on``` - данный метод устанавливает обработчик ```callback ```на событие с именем ```eventName```.
- ```off``` - данный метод убирает ```callback``` с события.
- ```emit``` - данный метод вызывает событие с именем ```eventName``` и передает данные ```data``` всем подписчикам этого события.
- ```onAll``` - данный метод устанавливает обработчик ```callback``` на все события.
- ```offAll``` - данный метод удаляет все события и обработчики из ```events```.
- ```trigger``` - данный метод создает "триггер" для события, при определенном контексте ```context``` для инициации.

### Класс Api
Класс для работы с API приложения, выполняющий HTTP запросы

- ```baseUrl``` - получает базовый url
- ```options``` - опции запросов

#### Конструктор
Конструктор принимает строку - базовый URL, и объект параметров запроса (необязательный параметр) в формате ```RequestInit```. Устанавливает заголовок Content-Type в application/json для всех запросов.

#### Методы
- ```handleResponse``` - обрабатывает ответ от сервера, если запрос успешен, возвращает результат в формате JSON, если нет - возвращает данные об ошибке.
- ```GET``` - GET-запрос к указанному URI и возвращает Promise с данными в формате JSON.
- ```POST``` - POST-запрос указанному URI с переданными данными (в формате объекта)

### Класс WebLarekApi
WebLarekApi - класс расширяет родительский класс Api и реализует интерфейс IWebLarekApi(содержит методы, описанные в классе). Он включает в себя методы для получения информации о продуктах, и размещения заказа.

#### Конструктор
В конструкторе этого класса вызывается конструктор класса Api, передавая ему ```baseUrl``` в формате строки и ```options``` в формате ```RequestInit```, и затем устанавливается свойство ```cdn``` (это url строка) с переданным значением.

#### Методы
- ``` getProducts```  - данный метод отправляет GET-запрос на эндпоинт /product, который возвращает список продуктов с сервера.
- ``` getOrder```  - данный метод отправляет POST-запрос на эндпоинт /order, передавая объект order.

### Класс AppState

#### Интерфейс IAppState
- ```catalog``` - элементы(товары) из каталога
- ```order``` - данные формы заказа
- ```basket``` - элементы каталога, добавленные в корзину
- ```preview``` - превью товара

#### Класс AppState - Класс, описывающий состояние приложения, расширяется Model<T> с интерфейсом IAppState

- ```catalog``` - массив товаров IProductItem, каталог
- ```basket``` - массив товаров IProductItem, корзина
- ```order``` - представляет информацию о заказе, включая общую стоимость заказа (total), список товаров (items), номер телефона (phone), электроннаую почту (email), способ оплаты (payment) и адрес доставки (address).
- ```formError``` - информация об ошибках в полях формы.
- ```preview``` - превью конкретного товара, является строкой или null.

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
-``` validateInfo``` - валидация данных о заказчике (номер, почта).

### Класс ```Model```
Базовая модель, чтобы можно было отличить ее от простых объектов с данными.
Это абстрактный класс, который является шаблоном для создания новых моделей данных.

#### Конструктор
Принимает объект ```data``` с неявным типом и объект события с типом ```IEvents```.
С помощью метода ```Object.assign``` копирует данные из объекта ```data``` и передает их в новый.

#### Методы
Метод ```emitChanges``` сообщает об изменении данных в модели, используя ```EventEmitter```.

### Функция isModel
Данная функция проверяет является ли объект моделью.
```obj``` - объект для проверки.

### Класс ```Component```
Абстрактный класс для создания и отображения компонентов

#### Конструктор
Принимает ```container``` с типом ```HTMLElement```, который является контейнером для компонента.

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

### Класс ProductItem

#### Интерфейс IProductItem
Интерфейс, описывающий товар в каталоге.
- ```id``` - персональный ID товара
- ```title``` - название товара
- ```description``` - описание товара
- ```image``` - изображение товара
- ```price``` - стоимость товара
- ```category``` - категория товара

#### ProductItem - Класс, основанный на Model<T>, отображает товар

- ```id``` - персональный ID товара, тип строка
- ```title``` - название товара, тип строка
- ```description``` - описание товара, тип строка
- ```image``` - изображение товара, тип строка
- ```price``` - стоимость товара, тип номер или null
- ```category``` - категория товара, тип строка

### Класс Page

#### Интерфейс IPage
Интерфейс для отображения страницы 
- ```counter``` - счетчик товаров 
- ```catalog``` - массив товаров на странице
- ```locked``` - блокировка прокрутки страницы

#### Page - Класс представления, отображает элементы на странице 

- ```counter``` - защищенное свойство, хранит количество товаров в корзине.
- ```catalog``` - защищенное свойство, каталог товаров на странице
- ```wrapper``` - защищенное свойство, разметка страницы
- ```basket``` - защищенное свойство, кнопка корзины

#### Конструктор
Принимает ```container``` с типом ```HTMLElement```  и объект событий типа ```IEvents```.
У корзины имеетя обработчик события ("click), вызывает ```basket:open```. В констуркторе происходит инициализация свойств(counter, catalog, wrapper, basket), обработчик событий привязывается к элементу корзины ```basket```.

#### Методы
- ```set counter``` - сеттер для свойства ```counter```, определяет текстовое содержимое у счетчика.
- ```set catalog``` - сеттер для свойства ```catalog```, устанавливает каталог товаров. 
- ```set locked``` - сеттер для свойства ```locked```, добавляет или удаляет класс page__wrapper_locked у контейнера, то есть ставит или убирает блок с прокрутки страницы.

### Класс Form

#### Интерфейс IFormState
- ```valid``` - валидация формы
- ```errors``` - текст ошибки при валидации формы 

#### Form<T> - Класс для создания формы заполнения и её валидация
- ```submit``` - отправка формы 
- ```errors``` - ошибка валидации формы при заполнении

#### Конструктор
Принимает ```container``` с типом ```HTMLElement```  и объект событий типа ```IEvents```.
В конструкторе описаны инициализация элементов формы, установка обработчиков событий на введенные данные и отправку формы, и подписка на изменения значений в полях.

#### Методы
- ```onInputChange``` - данный метод вызывается при изменении значений в полях формы.
- ```set valid``` - данный метод устанавливает валдиацию в полях формы.
- ```set errors``` - данный метод устанавливает текстовое содержимое, сообщающее об ошибке  в полях формы
- ```render``` - рендер, обновляет состояние валидоности формы.

### Класс Card

#### Интерфейсы ICard и ICardActions

- ``` onClick```  - обработчик событий, работающий с карточкой товара, не возращает значение (void)

- ```selected``` - указывает, был выбран товар в корзину или нет, имеет тип boolean, принимающий true или false

#### Card<T> - Класс описывает карточку товара

- ```title``` - защищенное свойство, название товара 
- ```image``` - защищенное свойство, изображение товара
- ```description``` - защищенное свойство, описание товара (опционально)
- ```category``` - защищенное свойство, категория товара
- ```price``` - защищенное свойство, стоимость товара
- ```button``` - элемент кнопки на карточке товара

#### Конструктор
Конструктор принимает имя блока ```blockName``` в формате строки для определения элементов карточки, контейнер ```container``` типа ``` HTMLElement```  и опциональный объект ```actions```, в котором содержится обработчик событий из ```ICardActions```. В конструкторе происходит инициализация элементов карточки.
Если передан обработчик ```onClick```, он добавляется к кнопке карточки.

#### Методы
- set/get id - Геттер и Сеттер для персонального id товара
- set/get title - Геттер и Сеттер для названия товара
- set image - Сеттер для изображения товара
- set description - Сеттер для описания товара
- set/get category - Сеттер и геттер категории товара
- set/get price - Сеттер и геттер категории товара

### Класс Basket

#### Интерфейс IBasket
Интерфейс корзины товаров
- ```items``` - массив элементов с товаром
- ```total``` - общая стоимость товаров

#### Basket - Класс описывающий корзину товаров

- ```list```  - защищенное свойство, хранит список товаров в корзине.
- ``` total```  - защищенное свойство, хранит общую стоимость.
- ``` button```  - защищенное свойство, хранит разметку кнопки оформления заказа.

#### Конструктор
Принимает ```container``` с типом ```HTMLElement```  и объект событий типа ```IEvents```.
Элемент списка товаров ```list``` получает ссылку на соответствующий элемент DOM с классом ```basket__list```.
Находится элемент ``` total``` в пределах контейнера и присваивает элемент с классом ```basket__price```.
Элемент ``` button``` получает ссылку на соотвестующий элемент DOM с классом ```basket__button```.
Если кнопка найдена, устанавливается слушатель событий ```click```, при нажатии срабатывает событие ```order:open```.

#### Методы 
- ```set items``` - Сеттер устанавливает элементы корзины. Если массив ```items``` содержит элементы, они заменяются в элементе списка ```list```, если нет - отображается текст "Корзина пуста".
-  ```set total``` - Сеттер вызывает метод setText и устанавливает общую стоимость товаров в корзине.

### Класс Modal

#### Интерфейс IModalData
Интерфейс для модального окна
- ```content``` - контент модального окна

#### Modal - Класс отображающий модальное окно приложения
- ```closeButton``` - защищенное свойство, элемент кнопки для закрытия модального окна
- ```content``` - защищенное свойство, контент модального окна

#### Конструктор
Принимает ```container``` с типом ```HTMLElement```  и объект событий типа ```IEvents```. В конструкторе инициализируются поля ```closeButton```и ```content```, находящиеся внутри контейнера.
У ```closeButton``` имеется слушатель событий ```click```. При клике на кнопку закрытия модального окна или при клике в области модального окна срабатывает вызов метода ```close```, а при клике внутри контента модального окна, событие не всплывает.

#### Методы 
- ```set content```- данный метод устанавливает содержимое модального окна, заменяет его на новое
- ```open()``` - данный метод позволяет открыть модальное окно, дабавляет класс ```modal_active``` к контейнеру модального окна и запускает событие ```modal:open```.
- ```close()``` - данный метод закрывает модальное окно, убирает класс ```modal_active``` из контейнера модального окна, тем самым очищает содержимое и запускает событие ```modal:close```.
- ```render``` - данный метод отрисовывает модальное окно, вызывая метод ```render ``` родительского класса Component<T>, открывая модальное окно и возвращая его контейнер. 

### Классы Order и Info

#### Order - Класс описывающий поля для оформления заказа (способ оплаты и адрес)

- ```card``` - защищенное свойство, выбор оплаты картой
- ```cash``` - защищенное свойство, выбор оплаты наличными

#### Конструктор
Принимает ```container``` с типом ```HTMLElement```  и объект событий типа ```IEvents```. Внутри конструктора вызывается конструктор родительского класса ```Form```, ему передается элемент формы и обработчик событий.
При обработке нажатия кнопки, наличие класса ```button_alt-active``` изменяется у ```card``` или ```cash``` (кнопки для выбора оплаты типа ```HTMLButtonElement```),  вызывается метод ```onInputChange``` из родительского класса ```Form<T>```, уведомляя об изменении значения.

#### Методы
- ```set address``` - данный сеттер устанавливает значение поля адреса в форме.


#### Info - Класс описывающий поля для оформления заказа (электронная почта и телефон)

#### Конструктор
Принимает ```container``` с типом ```HTMLElement```  и объект событий типа ```IEvents```. Внутри конструктора вызывается конструктор родительского класса ```Form```, ему передается элемент формы и обработчик событий.

#### Методы
- ```set phone``` - данный сетер устанавливает значение номера телефона 
- ```set email``` - данный сетер устанавливает значение электронной почты

### Класс Success

#### Интерфейсы ISuccess и ISuccessActions
- ```total``` - общая стоимость заказа, в формате числа

- ```onClick``` - обработчик событий, позволяет закрыть окно об успешном оформлении заказа, не возвращает значенния (void).

#### Success - Класс отображающий успешное оформление заказа
- ```total``` - защищенное свойство, общая стоимость заказа
- ```close``` - защищенное свойство, кнопка закрытия окна 

#### Конструктор
Конструктор принимает контейнер с типом HTMLElement и объект ```actions```, содержащий метод ```onClick``` из интерфейса ```ISuccessActions```. Конструктор передает контейнер в родительский конструктор и инициализирует элементы. В конструкторе устанавливается обработчик событий для элемента ```close```, при клике на него срабатывает ```actions.onClick```.

#### Методы 
- ```set total``` - данный метод устанавливает текстовое содержимое элементу ```total```, отображает информацию о списании суммы за заказ.
