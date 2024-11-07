// import './scss/styles.scss';
// import { ProductAPI } from "./components/ProductAPI";
// import { API_URL, CDN_URL } from "./utils/constants";
// import { EventEmitter } from "./components/base/events";
// import { AppState, CatalogChangeEvent, ProductItem } from "./components/AppData";
// import { Page } from "./components/Page";
// import { ProductItem as ProductCard } from "./components/Card";
// import { cloneTemplate, createElement, ensureElement } from "./utils/utils";
// import { Modal } from "./components/common/Modal";
// import { Basket } from "./components/common/Basket";
// import { IOrderForm, IOrderResult, IProduct } from "./types";
// import { Order } from "./components/Order";
// import { Success } from "./components/common/Success";

// document.addEventListener('DOMContentLoaded', () => {
//     const events = new EventEmitter();
//     const api = new ProductAPI(CDN_URL, API_URL);

//     // Чтобы мониторить все события, для отладки
//     events.onAll(({ eventName, data }) => {
//         console.log(eventName, data);
//     });

//     // Функция для создания шаблона, если он не найден
//     const createTemplate = (id: string, content: string) => {
//         const template = document.createElement('template');
//         template.id = id;
//         template.innerHTML = content;
//         document.body.appendChild(template);
//         return template;
//     };

//     // Проверка наличия шаблонов и создание их при необходимости
//     const cardCatalogTemplate = document.querySelector<HTMLTemplateElement>('#card') || createTemplate('card', `
//         <button class="gallery__item card">
//             <span class="card__category card__category_soft">софт-скил</span>
//             <h2 class="card__title">+1 час в сутках</h2>
//             <img class="card__image" src="<%=require('../images/Subtract.svg')%>" alt=""/>
//             <span class="card__price">750 синапсов</span>
//         </button>
//     `);
//     const cardPreviewTemplate = document.querySelector<HTMLTemplateElement>('#preview') || createTemplate('preview', `
//         <div class="modal__content">
//             <img class="modal__image" src="<%=require('../images/lot1.jpg')%>" alt=""/>
//             <div class="modal__details">
//                 <h1 class="modal__title"></h1>
//                 <p class="modal__description"></p>
//                 <span class="modal__category"></span>
//                 <span class="modal__price"></span>
//                 <button class="modal__action button">В корзину</button>
//             </div>
//         </div>
//     `);
//     const basketTemplate = document.querySelector<HTMLTemplateElement>('#basket') || createTemplate('basket', `
//         <div class="basket">
//             <ul class="basket__list"></ul>
//             <div class="modal__actions">
//                 <button class="button">Оформить</button>
//                 <span class="basket__price">0 синапсов</span>
//             </div>
//         </div>
//     `);
//     const orderTemplate = document.querySelector<HTMLTemplateElement>('#order') || createTemplate('order', `
//         <form class="form" name="order">
//             <div class="order">
//                 <label class="order__field">
//                     <span class="form__label modal__title">Email</span>
//                     <input class="form__input" type="email" placeholder="Введите Email"/>
//                 </label>
//                 <label class="order__field">
//                     <span class="form__label modal__title">Телефон</span>
//                     <input class="form__input" type="text" placeholder="+7 ("/>
//                 </label>
//                 <label class="order__field">
//                     <span class="form__label modal__title">Адрес доставки</span>
//                     <input class="form__input" type="text" placeholder="Введите адрес"/>
//                 </label>
//                 <label class="order__field">
//                     <span class="form__label modal__title">Способ оплаты</span>
//                     <select class="form__input" name="paymentMethod">
//                         <option value="online">Онлайн</option>
//                         <option value="upon_receipt">При получении</option>
//                     </select>
//                 </label>
//             </div>
//             <div class="modal__actions">
//                 <button type="submit" class="button">Оформить</button>
//                 <span class="form__errors"></span>
//             </div>
//         </form>
//     `);
//     const successTemplate = document.querySelector<HTMLTemplateElement>('#success') || createTemplate('success', `
//         <div class="order-success">
//             <h2 class="order-success__title">Заказ оформлен</h2>
//             <p class="order-success__description">Списано 0 синапсов</p>
//             <button class="button order-success__close">За новыми покупками!</button>
//         </div>
//     `);

//     // Проверка наличия элементов и создание их при необходимости
//     const catalogItems = document.querySelector<HTMLElement>('.catalog__items');
//     if (!catalogItems) {
//         const main = document.querySelector('main');
//         if (main) {
//             const catalog = document.createElement('div');
//             catalog.className = 'catalog__items';
//             main.appendChild(catalog);
//         } else {
//             console.error('Main element not found.');
//             return;
//         }
//     }
//     const modalContainer = document.querySelector<HTMLElement>('#modal-container');
//     if (!modalContainer) {
//         const body = document.querySelector('body');
//         if (body) {
//             const modal = document.createElement('div');
//             modal.id = 'modal-container';
//             modal.className = 'modal';
//             body.appendChild(modal);
//         } else {
//             console.error('Body element not found.');
//             return;
//         }
//     }

//     // Модель данных приложения
//     const appData = new AppState({}, events);

//     // Глобальные контейнеры
//     const page = new Page(document.body, events);
//     const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

//     // Переиспользуемые части интерфейса
//     const basket = new Basket(cloneTemplate(basketTemplate), events);
//     const order = new Order(cloneTemplate(orderTemplate), events);

//     // Дальше идет бизнес-логика
//     // Поймали событие, сделали что нужно
//     // Изменились элементы каталога
//     events.on<CatalogChangeEvent>('items:changed', () => {
//         page.catalog = appData.catalog.map(item => {
//             const card = new ProductCard(cloneTemplate(cardCatalogTemplate), {
//                 onClick: () => events.emit('card:select', item)
//             });
//             return card.render({
//                 title: item.title,
//                 image: item.image,
//                 category: item.category,
//                 price: item.price !== null ? `${item.price} синапсов` : 'Бесценно'
//             });
//         });
//         page.counter = appData.getAvailableProducts().length;
//     });

//     // Отправлена форма заказа
//     events.on('order:submit', () => {
//         api.orderProducts(appData.order)
//             .then((result: IOrderResult) => {
//                 const success = new Success(cloneTemplate(successTemplate), {
//                     onClick: () => {
//                         modal.close();
//                         appData.clearBasket();
//                         events.emit('catalog:changed');
//                     }
//                 });
//                 modal.render({
//                     content: success.render({})
//                 });
//             })
//             .catch((err: any) => {
//                 console.error(err);
//             });
//     });

//     // Изменилось состояние валидации формы
//     events.on('formErrors:change', (errors: Partial<IOrderForm>) => {
//         const { email, phone, address, paymentMethod } = errors;
//         order.valid = !email && !phone && !address && !paymentMethod;
//         order.errors = Object.values({ phone, email, address, paymentMethod }).filter(i => !!i).join('; ');
//     });

//     // Изменилось одно из полей
//     events.on(/^order\\..*:change/, (data: { field: keyof IOrderForm, value: string }) => {
//         appData.setOrderField(data.field, data.value);
//     });

//     // Открыть форму заказа
//     events.on('order:open', () => {
//         modal.render({
//             content: order.render({
//                 phone: '',
//                 email: '',
//                 address: '',
//                 paymentMethod: 'online',
//                 valid: false,
//                 errors: []
//             })
//         });
//     });

//     // Открыть активные товары
//     events.on('bids:open', () => {
//         modal.render({
//             content: basket.render()
//         });
//     });

//     // Открыть закрытые товары
//     events.on('basket:open', () => {
//         modal.render({
//             content: basket.render()
//         });
//     });

//     // Изменения в товаре, но лучше все пересчитать
//     events.on('catalog:changed', () => {
//         page.counter = appData.basket.length;
//         basket.items = appData.basket.map(id => {
//             const item = appData.catalog.find(product => product.id === id);
//             const card = new ProductCard(cloneTemplate(cardCatalogTemplate), {
//                 onClick: () => events.emit('preview:changed', item)
//             });
//             return card.render({
//                 title: item.title,
//                 image: item.image,
//                 category: item.category,
//                 price: item.price !== null ? `${item.price} синапсов` : 'Бесценно'
//             });
//         });
//         basket.total = appData.getTotal();
//     });

//     // Открыть товар
//     events.on('card:select', (item: ProductItem) => {
//         appData.setPreview(item);
//     });

//     // Изменен открытый выбранный товар
//     events.on('preview:changed', (item: ProductItem) => {
//         const showItem = (item: ProductItem) => {
//             const card = new ProductCard(cloneTemplate(cardPreviewTemplate));
//             modal.render({
//                 content: card.render({
//                     title: item.title,
//                     image: item.image,
//                     description: item.description,
//                     category: item.category,
//                     price: item.price !== null ? `${item.price} синапсов` : 'Бесценно'
//                 })
//             });
//         };
//         if (item) {
//             api.getProductItem(item.id)
//                 .then((result: IProduct) => {
//                     item.description = result.description;
//                     showItem(item);
//                 })
//                 .catch((err: any) => {
//                     console.error(err);
//                 });
//         } else {
//             modal.close();
//         }
//     });

//     // Блокируем прокрутку страницы если открыта модалка
//     events.on('modal:open', () => {
//         page.locked = true;
//     });

//     // ... и разблокируем
//     events.on('modal:close', () => {
//         page.locked = false;
//     });

//     // Получаем товары с сервера
//     api.getProductList()
//         .then(appData.setCatalog.bind(appData))
//         .catch((err: any) => {
//             console.error(err);
//         });
// });




// import './scss/styles.scss';
// import { ProductAPI } from "./components/ProductAPI";
// import { API_URL, CDN_URL } from "./utils/constants";
// import { EventEmitter } from "./components/base/events";
// import { AppState, CatalogChangeEvent, ProductItem } from "./components/AppData";
// import { Page } from "./components/Page";
// import { ProductItem as ProductCard } from "./components/Card";
// import { cloneTemplate, createElement, ensureElement } from "./utils/utils";
// import { Modal } from "./components/common/Modal";
// import { Basket } from "./components/common/Basket";
// import { IOrderForm, IOrderResult, IProduct } from "./types";
// import { Order } from "./components/Order";
// import { Success } from "./components/common/Success";

// document.addEventListener('DOMContentLoaded', () => {
//     const events = new EventEmitter();
//     const api = new ProductAPI(CDN_URL, API_URL);

//     // Чтобы мониторить все события, для отладки
//     events.onAll(({ eventName, data }) => {
//         console.log(eventName, data);
//     });

//     // Все шаблоны
//     const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
//     const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
//     const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
//     const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
//     const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
//     const successTemplate = ensureElement<HTMLTemplateElement>('#success');

//     // Проверка наличия элементов и создание их при необходимости
//     const catalogItems = document.querySelector<HTMLElement>('.catalog__items');
//     if (!catalogItems) {
//         const main = document.querySelector('main');
//         if (main) {
//             const catalog = document.createElement('div');
//             catalog.className = 'catalog__items';
//             main.appendChild(catalog);
//         } else {
//             console.error('Main element not found.');
//             return;
//         }
//     }

//     // Модель данных приложения
//     const appData = new AppState({}, events);

//     // Глобальные контейнеры
//     const page = new Page(document.body, events);
//     const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

//     // Переиспользуемые части интерфейса
//     const basket = new Basket(cloneTemplate(basketTemplate), events);
//     const order = new Order(cloneTemplate(orderTemplate), events);

//     // Инициализация состояния корзины и счетчика
//     page.counter = appData.basket.length;

//     // Дальше идет бизнес-логика
//     // Поймали событие, сделали что нужно
//     // Изменились элементы каталога
//     events.on<CatalogChangeEvent>('items:changed', () => {
//         page.catalog = appData.catalog.map(item => {
//             const card = new ProductCard(cloneTemplate(cardCatalogTemplate), {
//                 onClick: () => events.emit('card:select', item)
//             });
//             return card.render({
//                 title: item.title,
//                 image: item.image,
//                 category: item.category,
//                 price: item.price !== null ? `${item.price} синапсов` : 'Бесценно'
//             });
//         });
//         page.counter = appData.getAvailableProducts().length;
//     });

//     // Отправлена форма заказа
//     events.on('order:submit', () => {
//         api.orderProducts(appData.order)
//             .then((result: IOrderResult) => {
//                 const success = new Success(cloneTemplate(successTemplate), {
//                     onClick: () => {
//                         modal.close();
//                         appData.clearBasket();
//                         events.emit('catalog:changed');
//                     }
//                 });
//                 modal.render({
//                     content: success.render({})
//                 });
//             })
//             .catch((err: any) => {
//                 console.error(err);
//             });
//     });

//     // Изменилось состояние валидации формы
//     events.on('formErrors:change', (errors: Partial<IOrderForm>) => {
//         const { email, phone, address, paymentMethod } = errors;
//         order.valid = !email && !phone && !address && !paymentMethod;
//         order.errors = Object.values({ phone, email, address, paymentMethod }).filter(i => !!i).join('; ');
//     });

//     // Изменилось одно из полей
//     events.on(/^order\\..*:change/, (data: { field: keyof IOrderForm, value: string }) => {
//         appData.setOrderField(data.field, data.value);
//     });

//     // Открыть форму заказа
//     events.on('order:open', () => {
//         modal.render({
//             content: order.render({
//                 phone: '',
//                 email: '',
//                 address: '',
//                 paymentMethod: 'online',
//                 valid: false,
//                 errors: []
//             })
//         });
//     });

//     // Открыть форму контактов
//     events.on('contacts:open', () => {
//         const contactsForm = new Order(cloneTemplate(contactsTemplate), events);
//         modal.render({
//             content: contactsForm.render({
//                 phone: '',
//                 email: '',
//                 valid: false,
//                 errors: []
//             })
//         });
//     });

//     // Открыть корзину
//     events.on('basket:open', () => {
//         modal.render({
//             content: basket.render()
//         });
//     });

//     // Изменения в товаре, но лучше все пересчитать
//     events.on('catalog:changed', () => {
//         page.counter = appData.basket.length;
//         basket.items = appData.basket.map(id => {
//             const item = appData.catalog.find(product => product.id === id);
//             const card = new ProductCard(cloneTemplate(cardCatalogTemplate), {
//                 onClick: () => events.emit('preview:changed', item)
//             });
//             return card.render({
//                 title: item.title,
//                 image: item.image,
//                 category: item.category,
//                 price: item.price !== null ? `${item.price} синапсов` : 'Бесценно'
//             });
//         });
//         basket.total = appData.getTotal();
//     });

//     // Открыть товар
//     events.on('card:select', (item: ProductItem) => {
//         appData.setPreview(item);
//     });

//     // Изменен открытый выбранный товар
//     events.on('preview:changed', (item: ProductItem) => {
//         const showItem = (item: ProductItem) => {
//             const card = new ProductCard(cloneTemplate(cardPreviewTemplate));
//             modal.render({
//                 content: card.render({
//                     title: item.title,
//                     image: item.image,
//                     description: item.description,
//                     category: item.category,
//                     price: item.price !== null ? `${item.price} синапсов` : 'Бесценно'
//                 })
//             });
//         };
//         if (item) {
//             api.getProductItem(item.id)
//                 .then((result: IProduct) => {
//                     item.description = result.description;
//                     showItem(item);
//                 })
//                 .catch((err: any) => {
//                     console.error(err);
//                 });
//         } else {
//             modal.close();
//         }
//     });

//     // Блокируем прокрутку страницы если открыта модалка
//     events.on('modal:open', () => {
//         page.locked = true;
//     });

//     // ... и разблокируем
//     events.on('modal:close', () => {
//         page.locked = false;
//     });

//     // Получаем товары с сервера
//     api.getProductList()
//         .then(appData.setCatalog.bind(appData))
//         .catch((err: any) => {
//             console.error(err);
//         });
// });


// на 04.11.2024 рабочий вариант ниже

// import './scss/styles.scss';
// import { ProductAPI } from './components/ProductAPI';
// import { API_URL, CDN_URL } from './utils/constants';
// import { EventEmitter } from './components/base/events';
// import {
// 	AppState,
// 	CatalogChangeEvent,
// 	ProductItem,
// } from './components/AppData';
// import { Page } from './components/Page';
// import { ProductItem as ProductCard } from './components/Card';
// import { cloneTemplate, createElement, ensureElement } from './utils/utils';
// import { Modal } from './components/common/Modal';
// import { Basket } from './components/common/Basket';
// import { IOrderForm, IOrderResult, IProduct } from './types';
// import { Order } from './components/Order';
// import { Success } from './components/common/Success';

// document.addEventListener('DOMContentLoaded', () => {
// 	const events = new EventEmitter();
// 	const api = new ProductAPI(CDN_URL, API_URL);

// 	// Чтобы мониторить все события, для отладки
// 	events.onAll(({ eventName, data }) => {
// 		console.log(eventName, data);
// 	});

// 	// Функция для создания шаблона, если он не найден
// 	const createTemplate = (id: string, content: string) => {
// 		const template = document.createElement('template');
// 		template.id = id;
// 		template.innerHTML = content;
// 		document.body.appendChild(template);
// 		return template;
// 	};

// 	// Проверка наличия шаблонов и создание их при необходимости
// 	const cardCatalogTemplate =
// 		document.querySelector<HTMLTemplateElement>('#card') ||
// 		createTemplate(
// 			'card',
// 			`
//  <button class="gallery__item card">
//  <span class="card__category card__category_soft">софт-скил</span>
//  <h2 class="card__title">+1 час в сутках</h2>
//  <img class="card__image" src="<%=require('../images/Subtract.svg')%>" alt=""/>
//  <span class="card__price">750 синапсов</span>
//  </button>
//  `
// 		);
// 	const cardPreviewTemplate =
// 		document.querySelector<HTMLTemplateElement>('#card-preview') ||
// 		createTemplate(
// 			'preview',
// 			`
//  <div class="modal__content">
//  <img class="modal__image" src="<%=require('../images/lot1.jpg')%>" alt=""/>
//  <div class="modal__details">
//  <h1 class="modal__title"></h1>
//  <p class="modal__description"></p>
//  <span class="modal__category"></span>
//  <span class="modal__price"></span>
//  <button class="modal__action button">В корзину</button>
//  </div>
//  </div>
//  `
// 		);
// 	const basketTemplate =
// 		document.querySelector<HTMLTemplateElement>('#basket') ||
// 		createTemplate(
// 			'basket',
// 			`
//  <div class="basket">
//  <ul class="basket__list"></ul>
//  <div class="modal__actions">
//  <button class="button">Оформить</button>
//  <span class="basket__price">0 синапсов</span>
//  </div>
//  </div>
//  `
// 		);
// 	const orderTemplate =
// 		document.querySelector<HTMLTemplateElement>('#order') ||
// 		createTemplate(
// 			'order',
// 			`
//  <form class="form" name="order">
//  <div class="order">
//  <label class="order__field">
//  <span class="form__label modal__title">Email</span>
//  <input class="form__input" type="email" placeholder="Введите Email"/>
//  </label>
//  <label class="order__field">
//  <span class="form__label modal__title">Телефон</span>
//  <input class="form__input" type="text" placeholder="+7 ("/>
//  </label>
//  <label class="order__field">
//  <span class="form__label modal__title">Адрес доставки</span>
//  <input class="form__input" type="text" placeholder="Введите адрес"/>
//  </label>
//  <label class="order__field">
//  <span class="form__label modal__title">Способ оплаты</span>
//  <select class="form__input" name="paymentMethod">
//  <option value="online">Онлайн</option>
//  <option value="upon_receipt">При получении</option>
//  </select>
//  </label>
//  </div>
//  <div class="modal__actions">
//  <button type="submit" class="button">Оформить</button>
//  <span class="form__errors"></span>
//  </div>
//  </form>
//  `
// 		);
// 	const successTemplate =
// 		document.querySelector<HTMLTemplateElement>('#success') ||
// 		createTemplate(
// 			'success',
// 			`
//  <div class="order-success">
//  <h2 class="order-success__title">Заказ оформлен</h2>
//  <p class="order-success__description">Списано 0 синапсов</p>
//  <button class="button order-success__close">За новыми покупками!</button>
//  </div>
//  `
// 		);

// 	// Проверка наличия элементов и создание их при необходимости
// 	const catalogItems = document.querySelector<HTMLElement>('.catalog__items');
// 	if (!catalogItems) {
// 		const main = document.querySelector('main');
// 		if (main) {
// 			const catalog = document.createElement('div');
// 			catalog.className = 'catalog__items';
// 			main.appendChild(catalog);
// 		} else {
// 			console.error('Main element not found.');
// 			return;
// 		}
// 	}
// 	const modalContainer =
// 		document.querySelector<HTMLElement>('#modal-container');
// 	if (!modalContainer) {
// 		const body = document.querySelector('body');
// 		if (body) {
// 			const modal = document.createElement('div');
// 			modal.id = 'modal-container';
// 			modal.className = 'modal';
// 			body.appendChild(modal);
// 		} else {
// 			console.error('Body element not found.');
// 			return;
// 		}
// 	}

// 	// Модель данных приложения
// 	const appData = new AppState({}, events);

// 	// Глобальные контейнеры
// 	const page = new Page(document.body, events);
// 	const modal = new Modal(
// 		ensureElement<HTMLElement>('#modal-container'),
// 		events
// 	);

// 	// Переиспользуемые части интерфейса
// 	const basket = new Basket(cloneTemplate(basketTemplate), events);
// 	const order = new Order(cloneTemplate(orderTemplate), events);

// 	// Дальше идет бизнес-логика
// 	// Поймали событие, сделали что нужно
// 	// Изменились элементы каталога
// 	events.on<CatalogChangeEvent>('items:changed', () => {
// 		page.catalog = appData.catalog.map((item) => {
// 			const card = new ProductCard(cloneTemplate(cardCatalogTemplate), {
// 				onClick: () => events.emit('card:select', item),
// 			});
// 			return card.render({
// 				title: item.title,
// 				image: item.image,
// 				category: item.category,
// 				price: item.price !== null ? `${item.price} синапсов` : 'Бесценно',
// 			});
// 		});
// 		page.counter = appData.getAvailableProducts().length;
// 	});

// 	// Отправлена форма заказа
// 	events.on('order:submit', () => {
// 		api
// 			.orderProducts(appData.order)
// 			.then((result: IOrderResult) => {
// 				const success = new Success(cloneTemplate(successTemplate), {
// 					onClick: () => {
// 						modal.close();
// 						appData.clearBasket();
// 						events.emit('catalog:changed');
// 					},
// 				});
// 				modal.render({
// 					content: success.render({}),
// 				});
// 			})
// 			.catch((err: any) => {
// 				console.error(err);
// 			});
// 	});

// 	// Изменилось состояние валидации формы
// 	events.on('formErrors:change', (errors: Partial<IOrderForm>) => {
// 		const { email, phone, address, paymentMethod } = errors;
// 		order.valid = !email && !phone && !address && !paymentMethod;
// 		order.errors = Object.values({ phone, email, address, paymentMethod })
// 			.filter((i) => !!i)
// 			.join('; ');
// 	});

// 	// Изменилось одно из полей
// 	events.on(
// 		/^order\\..*:change/,
// 		(data: { field: keyof IOrderForm; value: string }) => {
// 			appData.setOrderField(data.field, data.value);
// 		}
// 	);

// 	// Открыть форму заказа
// 	events.on('order:open', () => {
// 		modal.render({
// 			content: order.render({
// 				phone: '',
// 				email: '',
// 				address: '',
// 				paymentMethod: 'online',
// 				valid: false,
// 				errors: [],
// 			}),
// 		});
// 	});

// 	// Открыть активные товары
// 	events.on('bids:open', () => {
// 		modal.render({
// 			content: basket.render(),
// 		});
// 	});

// 	// Открыть закрытые товары
// 	events.on('basket:open', () => {
// 		modal.render({
// 			content: basket.render(),
// 		});
// 	});

// 	// Изменения в товаре, но лучше все пересчитать
// 	events.on('catalog:changed', () => {
// 		console.log('appData.basket', appData.basket)
// 		console.log('basket', basket)
// 		page.counter = appData.basket.length;
// 		basket.items = appData.basket.map((id) => {
// 			const item = appData.catalog.find((product) => product.id === id);
// 			const card = new ProductCard(cloneTemplate(cardCatalogTemplate), {
// 				onClick: () => events.emit('preview:changed', item),
// 			});
// 			return card.render({
// 				title: item.title,
// 				image: item.image,
// 				category: item.category,
// 				price: item.price !== null ? `${item.price} синапсов` : 'Бесценно',
// 			});
// 		});
// 		basket.total = appData.getTotal();
// 	});

// 	// Открыть товар
// 	events.on('card:select', (item: ProductItem) => {
// 		appData.setPreview(item);
// 	});

// //    Обработчик для добавления товара в корзину
//    events.on('card:addToBasket', (item: ProductItem) => {
//       appData.toggleOrderedProduct(item.id, true); 
//       events.emit('catalog:changed'); 
//   });

// 	// Изменен открытый выбранный товар
// 	events.on('preview:changed', (item: ProductItem) => {
//       console.log('item', item)
//       console.log('cardPreviewTemplate', cardPreviewTemplate)
// 		const showItem = (item: ProductItem) => {
// 			const card = new ProductCard(cloneTemplate(cardPreviewTemplate),  {
//             // Вот сюда внести изменеия 02112024
// 				onClick: () => {console.log('onclick item', item); events.emit('card:addToBasket', item) },
// 			});
// 			modal.render({
// 				content: card.render({
// 					title: item.title,
// 					image: item.image,
// 					description: item.description,
// 					category: item.category,
// 					price: item.price !== null ? `${item.price} синапсов` : 'Бесценно',
// 				}),
// 			});
// 		};
// 		if (item) {
// 			api
// 				.getProductItem(item.id)
// 				.then((result: IProduct) => {
// 					item.description = result.description;
// 					showItem(item);
// 				})
// 				.catch((err: any) => {
// 					console.error(err);
// 				});
// 		} else {
// 			modal.close();
// 		}
// 	});

// 	// Блокируем прокрутку страницы если открыта модалка
// 	events.on('modal:open', () => {
// 		page.locked = true;
// 	});

// 	// ... и разблокируем
// 	events.on('modal:close', () => {
// 		page.locked = false;
// 	});

// 	// Получаем товары с сервера
// 	api
// 		.getProductList()
// 		.then(appData.setCatalog.bind(appData))
// 		.catch((err: any) => {
// 			console.error(err);
// 		});
// });


// const card = new ProductCard(cloneTemplate(cardPreviewTemplate), {
//    onClick: () => {
//        appData.addToBasket(item.id); // Добавление товара в корзину
//        console.log('onclick item', item);
//    },



import './scss/styles.scss';
import { ProductAPI } from './components/ProductAPI';
import { API_URL, CDN_URL } from './utils/constants';
import { EventEmitter } from './components/base/events';
import {
	AppState,
	CatalogChangeEvent,
	ProductItem,
} from './components/AppData';
import { Page } from './components/Page';
import { ProductItem as ProductCard } from './components/Card';
import { cloneTemplate, createElement, ensureElement } from './utils/utils';
import { Modal } from './components/common/Modal';
import { Basket } from './components/common/Basket';
import { IOrderForm, IOrderResult, IProduct } from './types';
import { Order } from './components/Order';
import { Success } from './components/common/Success';


document.addEventListener('DOMContentLoaded', () => {
	const events = new EventEmitter();
	const api = new ProductAPI(CDN_URL, API_URL);

	// Чтобы мониторить все события, для отладки
	events.onAll(({ eventName, data }) => {
		console.log(eventName, data);
	});

	// Функция для создания шаблона, если он не найден
	const createTemplate = (id: string, content: string) => {
		const template = document.createElement('template');
		template.id = id;
		template.innerHTML = content;
		document.body.appendChild(template);
		return template;
	};


	const cardBasketTemplate =
	document.querySelector<HTMLTemplateElement>('#card-basket');

	// Проверка наличия шаблонов и создание их при необходимости
	const cardCatalogTemplate =
		document.querySelector<HTMLTemplateElement>('#card') ||
		createTemplate(
			'card',
			`
 <button class="gallery__item card">
 <span class="card__category card__category_soft">софт-скил</span>
 <h2 class="card__title">+1 час в сутках</h2>
 <img class="card__image" src="<%=require('../images/Subtract.svg')%>" alt=""/>
 <span class="card__price">750 синапсов</span>
 </button>
 `
		);
	const cardPreviewTemplate =
		document.querySelector<HTMLTemplateElement>('#card-preview') ||
		createTemplate(
			'preview',
			`
 <div class="modal__content">
 <img class="modal__image" src="<%=require('../images/lot1.jpg')%>" alt=""/>
 <div class="modal__details">
 <h1 class="modal__title"></h1>
 <p class="modal__description"></p>
 <span class="modal__category"></span>
 <span class="modal__price"></span>
 <button class="modal__action button">В корзину</button>
 </div>
 </div>
 `
		);
	const basketTemplate =
		document.querySelector<HTMLTemplateElement>('#basket') ||
		createTemplate(
			'basket',
			`
 <div class="basket">
 <ul class="basket__list"></ul>
 <div class="modal__actions">
 <button class="button">Оформить</button>
 <span class="basket__price">0 синапсов</span>
 </div>
 </div>
 `
		);
	const orderTemplate =
		document.querySelector<HTMLTemplateElement>('#order') ||
		createTemplate(
			'order',
			`
 <form class="form" name="order">
 <div class="order">
 <label class="order__field">
 <span class="form__label modal__title">Email</span>
 <input class="form__input" type="email" placeholder="Введите Email"/>
 </label>
 <label class="order__field">
 <span class="form__label modal__title">Телефон</span>
 <input class="form__input" type="text" placeholder="+7 ("/>
 </label>
 <label class="order__field">
 <span class="form__label modal__title">Адрес доставки</span>
 <input class="form__input" type="text" placeholder="Введите адрес"/>
 </label>
 <label class="order__field">
 <span class="form__label modal__title">Способ оплаты</span>
 <select class="form__input" name="paymentMethod">
 <option value="online">Онлайн</option>
 <option value="upon_receipt">При получении</option>
 </select>
 </label>
 </div>
 <div class="modal__actions">
 <button type="submit" class="button">Оформить</button>
 <span class="form__errors"></span>
 </div>
 </form>
 `
		);
	const successTemplate =
		document.querySelector<HTMLTemplateElement>('#success') ||
		createTemplate(
			'success',
			`
 <div class="order-success">
 <h2 class="order-success__title">Заказ оформлен</h2>
 <p class="order-success__description">Списано 0 синапсов</p>
 <button class="button order-success__close">За новыми покупками!</button>
 </div>
 `
		);

	// Проверка наличия элементов и создание их при необходимости
	const catalogItems = document.querySelector<HTMLElement>('.catalog__items');
	if (!catalogItems) {
		const main = document.querySelector('main');
		if (main) {
			const catalog = document.createElement('div');
			catalog.className = 'catalog__items';
			main.appendChild(catalog);
		} else {
			console.error('Main element not found.');
			return;
		}
	}
	const modalContainer =
		document.querySelector<HTMLElement>('#modal-container');
	if (!modalContainer) {
		const body = document.querySelector('body');
		if (body) {
			const modal = document.createElement('div');
			modal.id = 'modal-container';
			modal.className = 'modal';
			body.appendChild(modal);
		} else {
			console.error('Body element not found.');
			return;
		}
	}

	// Модель данных приложения
	const appData = new AppState({}, events);

	// Глобальные контейнеры
	const page = new Page(document.body, events);
	const modal = new Modal(
		ensureElement<HTMLElement>('#modal-container'),
		events
	);

	// Переиспользуемые части интерфейса
	const basket = new Basket(cloneTemplate(basketTemplate), events);
	const order = new Order(cloneTemplate(orderTemplate), events);

	// Дальше идет бизнес-логика
	// Поймали событие, сделали что нужно
	// Изменились элементы каталога
	events.on<CatalogChangeEvent>('items:changed', () => {
		page.catalog = appData.catalog.map((item) => {
			const card = new ProductCard(cloneTemplate(cardCatalogTemplate), {
				onClick: () => events.emit('card:select', item),
			});
			return card.render({
				title: item.title,
				image: item.image,
				category: item.category,
				price: item.price !== null ? `${item.price} синапсов` : 'Бесценно',
			});
		});
		page.counter = appData.getAvailableProducts().length;
	});

	// Отправлена форма заказа
	events.on('order:submit', () => {
		api
			.orderProducts(appData.order)
			.then((result: IOrderResult) => {
				const success = new Success(cloneTemplate(successTemplate), {
					onClick: () => {
						modal.close();
						appData.clearBasket();
						events.emit('catalog:changed');
					},
				});
				modal.render({
					content: success.render({}),
				});
			})
			.catch((err: any) => {
				console.error(err);
			});
	});

	// Изменилось состояние валидации формы
	events.on('formErrors:change', (errors: Partial<IOrderForm>) => {
		const { email, phone, address, paymentMethod } = errors;
		order.valid = !email && !phone && !address && !paymentMethod;
		order.errors = Object.values({ phone, email, address, paymentMethod })
			.filter((i) => !!i)
			.join('; ');
	});

	// Изменилось одно из полей
	events.on(
		/^order\\..*:change/,
		(data: { field: keyof IOrderForm; value: string }) => {
			appData.setOrderField(data.field, data.value);
		}
	);

	// Открыть форму заказа
	events.on('order:open', () => {
		modal.render({
			content: order.render({
				phone: '',
				email: '',
				address: '',
				paymentMethod: 'online',
				valid: false,
				errors: [],
			}),
		});
	});

	// Открыть активные товары
	events.on('bids:open', () => {
		modal.render({
			content: basket.render(),
		});
	});

	// // Открыть закрытые товары
	// events.on('basket:open', () => {
	// 	modal.render({
	// 		content: basket.render(),
	// 	});
	// });


// Открыть закрытые лоты
events.on('basket:open', () => {
    modal.render({
        content: createElement<HTMLElement>('div', {}, [
            basket.render()
        ])
    });
});

	// Изменения в товаре, но лучше все пересчитать
	events.on('catalog:changed', () => {
		console.log('appData.basket', appData.basket)
		console.log('basket', basket)
		page.counter = appData.basket.length;
		basket.items = appData.basket.map((id) => {
			const item = appData.catalog.find((product) => product.id === id);
			const card = new ProductCard(cloneTemplate(cardCatalogTemplate), {
				onClick: () => events.emit('preview:changed', item),
			});
			return card.render({
				title: item.title,
				image: item.image,
				category: item.category,
				price: item.price !== null ? `${item.price} синапсов` : 'Бесценно',
			});
		});
		basket.total = appData.getTotal();
	});

	// Открыть товар
	events.on('card:select', (item: ProductItem) => {
		appData.setPreview(item);
	});

//    Обработчик для добавления товара в корзину
   events.on('card:addToBasket', (item: ProductItem) => {
      appData.toggleOrderedProduct(item.id, true); 
    //   events.emit('catalog:changed'); 
	  console.log('order.items', appData.order.items);
	//   basket.items = appData.order.items.map(item => {
    //     const card = new ProductCard(cloneTemplate(cardBasketTemplate), {
    //         onClick: () => {
    //             appData.toggleOrderedProduct(item, false);
    //             basket.total = appData.getTotal();
    //             basket.selected = appData.order.items;
    //         }
    //     });
	
	// 	// получить продукт с id, из appdata
    //     return card.render({
    //         title: item.title,
    //         image: item.image,
    //         status: {
    //             amount: item.price,
    //             status: item.isMyBid
    //         }
    //     });
    // });
    // basket.selected = appData.order.items;
    // basket.total = total;
  });

	// Изменен открытый выбранный товар
	events.on('preview:changed', (item: ProductItem) => {
      console.log('item', item)
      console.log('cardPreviewTemplate', cardPreviewTemplate)
		const showItem = (item: ProductItem) => {
			const card = new ProductCard(cloneTemplate(cardPreviewTemplate),  {
            // Вот сюда внести изменеия 02112024
				onClick: () => {console.log('onclick item', item); events.emit('card:addToBasket', item) },
			});
			modal.render({
				content: card.render({
					title: item.title,
					image: item.image,
					description: item.description,
					category: item.category,
					price: item.price !== null ? `${item.price} синапсов` : 'Бесценно',
				}),
			});
		};
		if (item) {
			api
				.getProductItem(item.id)
				.then((result: IProduct) => {
					item.description = result.description;
					showItem(item);
				})
				.catch((err: any) => {
					console.error(err);
				});
		} else {
			modal.close();
		}
	});

	// Блокируем прокрутку страницы если открыта модалка
	events.on('modal:open', () => {
		page.locked = true;
	});

	// ... и разблокируем
	events.on('modal:close', () => {
		page.locked = false;
	});

	// Получаем товары с сервера
	api
		.getProductList()
		.then(appData.setCatalog.bind(appData))
		.catch((err: any) => {
			console.error(err);
		});
});
