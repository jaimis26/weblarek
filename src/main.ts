import "./scss/styles.scss";
import { ensureElement, cloneTemplate } from "./utils/utils";
import { EventEmitter } from "./components/base/Events";
import { Api } from "./components/base/Api";
import { DataService } from "./components/models/DataService";
import { API_URL, CDN_URL } from "./utils/constants";
import { ProductCatalog } from "./components/models/ProductCatalog";
import { ShoppingCart } from "./components/models/ShoppingCart";
import { Header } from "./components/views/Header";
import { Gallery } from "./components/views/Gallery";
import { CardCatalog } from "./components/views/CardCatalog";
import { Preview } from "./components/views/Preview";
import { Modal } from "./components/views/Modal";
import { CardBasket } from "./components/views/CardBasket";
import { FormOrder } from "./components/views/FormOrder";
import { IProduct, TPayment } from "./types";
import { BuyerData } from "./components/models/BuyerData";
import { Contacts } from "./components/views/Contacts";
import { Basket } from "./components/views/Basket";
import { SuccessView } from "./components/views/Success";

const events = new EventEmitter();
const api = new Api(API_URL);
const dataService = new DataService(api);
const productCatalog = new ProductCatalog(events);
const cart = new ShoppingCart(events);
const buyer = new BuyerData(events);
const galleryContainer = ensureElement<HTMLElement>(".gallery");
const gallery = new Gallery(galleryContainer, events);
const modalContainer = ensureElement<HTMLElement>(".modal");
const modal = new Modal(modalContainer, events);
const headerContainer = ensureElement<HTMLElement>(".header");
const header = new Header(events, headerContainer);
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>("#card-catalog");
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>("#card-preview");
const cardBasketTemplate = ensureElement<HTMLTemplateElement>("#card-basket");
const basketTemplate = ensureElement<HTMLTemplateElement>("#basket");
const basketContainer = cloneTemplate(basketTemplate);
const basket = new Basket(events, basketContainer);
const basketElement = basketContainer;

const orderTemplate = ensureElement<HTMLTemplateElement>("#order");
const contactsTemplate = ensureElement<HTMLTemplateElement>("#contacts");
const successTemplate = ensureElement<HTMLTemplateElement>("#success");
const successContainer = cloneTemplate(successTemplate);
const successView = new SuccessView(successContainer, events);
const successElement = successContainer;

const orderContainer = cloneTemplate(orderTemplate) as HTMLFormElement;
const contactsContainer = cloneTemplate(contactsTemplate) as HTMLFormElement;
const previewContainer = cloneTemplate(cardPreviewTemplate) as HTMLElement;

const order = new FormOrder(orderContainer, events);
const contacts = new Contacts(contactsContainer, events);
const preview = new Preview(previewContainer, events);
const previewElement = previewContainer;

const getCatalogCards = () =>
  productCatalog.getProducts().map((item) => {
    const card = new CardCatalog(cloneTemplate(cardCatalogTemplate), {
      onClick: () => events.emit("card:select", item),
    });
    return card.render({
      title: item.title,
      price: item.price,
      category: item.category,
      image: CDN_URL + item.image,
    });
  });

dataService
  .loadProducts()
  .then((data) => {
    if (data?.items) {
      productCatalog.setProducts(data.items);
    }
  })
  .catch(console.error);

events.on("catalog:changed", () => {
  gallery.catalog = getCatalogCards();
});

events.on<IProduct>("card:select", (item) => {
  productCatalog.setSelectedProduct(item);
});

events.on("product:changed", () => {
  const item = productCatalog.getSelectedProduct();
  if (!item) return;

  const buttonText =
    item.price === null
      ? "Недоступно"
      : cart.hasItem(item.id)
        ? "Удалить из корзины"
        : "Купить";

  preview.render({
    title: item.title,
    price: item.price,
    image: CDN_URL + item.image,
    category: item.category,
    text: item.description || "",
  });

  preview.buttonText = buttonText;
  preview.disableBtn = item.price === null;

  modal.content = previewElement;
  modal.open();
});

events.on("cardButton:clicked", () => {
  const item = productCatalog.getSelectedProduct();
  if (!item || item.price === null) return;

  if (cart.hasItem(item.id)) {
    cart.removeItem(item.id);
  } else {
    cart.addItem(item);
  }
  modal.close();
});

events.on("modal:close", () => {
  modal.close();
});

const getBasketCards = () =>
  cart.getItems().map((item, index) => {
    const cardContainer = cloneTemplate(cardBasketTemplate);
    const card = new CardBasket(cardContainer, {
      onClick: () => events.emit("basket:delete", { id: item.id }),
    });
    card.index = index + 1;
    card.title = item.title;
    card.price = item.price;
    return cardContainer;
  });

events.on("basket:delete", (data: { id: string }) => {
  cart.removeItem(data.id);
});

events.on("basket:changed", () => {
  header.counter = cart.getCount();
  const items = getBasketCards();
  const total = cart.getTotalPrice();
  const isEmpty = items.length === 0;
  basket.list = items;
  basket.price = total;
  basket.isDisabled = isEmpty;
});

events.on("basket:open", () => {
  modal.content = basketElement;
  modal.open();
});

events.on("basket:open", () => {
  const items = getBasketCards();
  const total = cart.getTotalPrice();
  const isEmpty = items.length === 0;

  basket.list = items;
  basket.price = total;
  basket.isDisabled = isEmpty;

  const btnEl = ensureElement<HTMLButtonElement>(
    ".basket__button",
    basketContainer,
  );

  if (!isEmpty) {
    btnEl.addEventListener(
      "click",
      () => {
        events.emit("order:open");
      },
      { once: true },
    );
  }

  modal.content = basketElement;
  modal.open();
});

const updateOrderForm = () => {
  const data = buyer.getBuyerData();
  const errors = buyer.validate();
  const messages: string[] = [];

  if (errors.payment) messages.push(errors.payment);
  if (errors.address) messages.push(errors.address);

  const isValid = messages.length === 0;

  order.render({
    payment: data.payment,
    address: data.address,
    errors: messages.join(". "),
  });

  order.valid = isValid;
};

const updateContactsForm = () => {
  const data = buyer.getBuyerData();
  const errors = buyer.validate();
  const messages: string[] = [];

  if (errors.email) messages.push(errors.email);
  if (errors.phone) messages.push(errors.phone);

  const isValid = messages.length === 0;

  contacts.render({
    email: data.email,
    phone: data.phone,
    errors: messages.join(". "),
  });

  contacts.valid = isValid;
};

events.on("payment:change", (data: { payment: TPayment }) => {
  buyer.setPayment(data.payment);
});

events.on("order:change", (data: { field: string; value: string }) => {
  if (data.field === "address") {
    buyer.setAddress(data.value);
  }
});

events.on("contacts:change", (data: { field: string; value: string }) => {
  if (data.field === "email") {
    buyer.setEmail(data.value);
  }
  if (data.field === "phone") {
    buyer.setPhone(data.value);
  }
});

events.on("buyer:changed", () => {
  updateOrderForm();
  updateContactsForm();
});

events.on("order:open", () => {
  modal.content = orderContainer;
  modal.open();
});

events.on("order:submit", () => {
  modal.content = contactsContainer;
  modal.open();
});

events.on("contacts:submit", async () => {
  const data = buyer.getBuyerData();

  if (data.payment === null) {
    return;
  }

  const itemIds = cart.getItems().map((item) => item.id);

  const orderData = {
    payment: data.payment,
    address: data.address,
    email: data.email,
    phone: data.phone,
    items: itemIds,
    total: cart.getTotalPrice(),
  };

  try {
    const result = await dataService.sendOrder(orderData);

    cart.clear();
    buyer.clearBuyerData();

    successView.totalPrice = result.total;

    modal.content = successElement;
    modal.open();
  } catch (error) {
    console.error("Не удалось оформить заказ", error);
  }
});

events.on("success:close", () => {
  modal.close();
});
