import './scss/styles.scss';

import { cloneTemplate, ensureElement } from './utils/utils';
import { WebLarekApi } from './components/WebLarekApi';
import { API_URL, CDN_URL } from './utils/constants';
import { EventEmitter } from './components/base/events';
import { Modal } from './components/common/Modal';
import { Basket } from './components/Basket';
import { Page } from './components/Page';
import { Card } from './components/Card';
import { Order, Contact } from './components/Order';
import {
	AppState,
	CatalogChangeEvent,
} from './components/AppData';
import { Success } from './components/Success';
import { IProductItem, IOrder, IOrderForm, IContactForm } from './types';

//Константы
const cardTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

const events = new EventEmitter();
const api = new WebLarekApi(CDN_URL, API_URL);

// Чтобы мониторить все события, для отладки
events.onAll(({ eventName, data }) => {
	console.log(eventName, data);
});

// Данные приложения
const appData = new AppState({}, events);

// Контейнеры
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const basket = new Basket(cloneTemplate(basketTemplate), events);
const order = new Order(cloneTemplate(orderTemplate), events);
const contacts = new Contact(cloneTemplate(contactsTemplate), events);

// Получение данных с сервера

api
	.getProducts()
	.then(appData.setCatalog.bind(appData))
	.catch((err) => {
		console.error(err);
	});

// Отображение каталога товаров
events.on<CatalogChangeEvent>('items:changed', () => {
	page.catalog = appData.catalog.map((item) => {
		const card = new Card(cloneTemplate(cardTemplate), {
			onClick: () => events.emit('card:select', item),
		});
		return card.render({
			title: item.title,
			image: item.image,
			price: item.price,
			category: item.category,
		});
	});
});

// Открытие карточки

events.on('card:select', (item: IProductItem) => {
	page.locked = true;
	const card = new Card(cloneTemplate(cardPreviewTemplate), {
	  onClick: () => {
		events.emit('card:toBasket', item);
		if (appData.basket.indexOf(item) !== -1) {
		  card.buttonState = 'Удалить из корзины'; 
		} else {
		  card.buttonState = 'В корзину';
		}
	  },
	});
	card.buttonState = appData.basket.indexOf(item) !== -1 ? 'Удалить из корзины' : 'В корзину';

	modal.render({
	  content: card.render({
		id: item.id,
		title: item.title,
		image: item.image,
		category: item.category,
		description: item.description,
		price: item.price,
	  }),
	});
  });

// Блокировка прокрутки страницы при открытии модального окна
events.on('modal:open', () => {
	page.locked = true;
});

// После закрытия модального окна, прокрутка страницы снова доступна
events.on('modal:close', () => {
	page.locked = false;
});

//Меняет значение кнопки в зависимости от того, добавлен товар в корзину или нет
events.on('card:toBasket', (item: IProductItem) => {
	if (appData.basket.indexOf(item) === -1) {
		events.emit('basket:add', item);
	} else {
		events.emit('basket:remove', item);
	}
});

// Добавление в корзину
events.on('basket:add', (item: IProductItem) => {
	appData.addBasket(item);
});

// Удаление из корзины
events.on('basket:remove', (item: IProductItem) => {
	appData.deleteBasket(item);
});

// Открытие корзины
events.on('basket:open', () => {
	modal.render({
		content: basket.render({
			total: appData.getTotal(),
		}),
	});
});

// Изменения в корзине
events.on('basket:change', () => {
	basket.items = appData.basket.map((item, index) => {
		const card = new Card(cloneTemplate(cardBasketTemplate), {
			onClick: () => {
				events.emit('basket:remove', item);
			},
		});
		return card.render({
			index: (index + 1).toString(),
			title: item.title,
			price: item.price,
		});
	});

	basket.total = appData.getTotal();
});

//Счетчик товаров в корзине
events.on('basket:change', () => {
	page.counter = appData.getBasketCount();
});

// Оформление заказа (способ оплаты и адрес)
events.on('order:open', () => {
	modal.render({
		content: order.render({
			payment: '',
			address: '',
			valid: false,
			errors: [],
		}),
	});
});

//Оформление заказа (номер телефона и электронная почта)
events.on('order:submit', () => {
	appData.getBasketItems();
	appData.order.total = appData.getTotal();
	modal.render({
		content: contacts.render({
			phone: '',
			email: '',
			valid: false,
			errors: [],
		}),
	});
});

//Состояние валидации в форме заказа (способ оплаты и адрес)
events.on('orderformErrors:change', (errors: Partial<IOrder>) => {
	const { address, payment } = errors;
	order.valid = !payment && !address;
	order.errors = Object.values({ payment, address })
		.filter((i) => !!i)
		.join('; ');
});

//Состояние валидации в форме заказа (номер телефона и электронная почта)
events.on('contactsformErrors:change', (errors: Partial<IContactForm>) => {
	const { email, phone } = errors;
	contacts.valid = !email && !phone;
	contacts.errors = Object.values({ email, phone })
		.filter((i) => !!i)
		.join('; ');
});

//Изменения в полях оформления заказа
events.on(
	/^order\..*:change/,
	(data: { field: keyof IOrderForm; value: string }) => {
		appData.setOrderField(data.field, data.value);
	}
);

events.on(
	/^contacts\..*:change/,
	(data: { field: keyof IContactForm; value: string }) => {
		appData.setContactField(data.field, data.value);
	}
);

//Отправлена форма заказа
events.on('contacts:submit', () => {
	api
		.getOrder(
			{
				...appData.order,
			}
		)
		.then((result) => {
			appData.clearBasket();
			const success = new Success(cloneTemplate(successTemplate), {
				onClick() {
					modal.close();
					appData.resetOrder();
				},
			});
			modal.render({
				content: success.render({
					total: result.total,
				}),
			});
		})
		.catch((err) => {
			console.error(err);
		});
});