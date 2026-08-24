import "./scss/styles.scss";
import { ProductCatalog } from "./components/models/ProductCatalog";
import { ShoppingCart } from "./components/models/ShoppingCart";
import { BuyerData } from "./components/models/BuyerData";
import { apiProducts } from "./utils/data";
import { Api } from "./components/base/Api";
import { DataService } from "./components/models/DataService";
import { API_URL } from "./utils/constants";

const catalog = new ProductCatalog();
console.log("Начало проверки ProductCatalog");

catalog.saveProducts(apiProducts.items);
const allProducts = catalog.getProducts();

console.log("Массив товаров из каталога:", allProducts);
console.log("Длина массива:", allProducts.length);

const firstProduct = allProducts[0];

if (firstProduct) {
  const foundProduct = catalog.getProductById(firstProduct.id);

  console.log('Найден продукт по ID "' + firstProduct.id + '":', foundProduct);

  console.log(
    "Совпадает ли найденный с элементом массива:",
    foundProduct === firstProduct,
  );

  if (foundProduct) {
    catalog.setSelectedProduct(foundProduct);

    const selectedProduct = catalog.getSelectedProduct();

    console.log("Выбранный продукт (из getSelectedProduct):", selectedProduct);

    console.log(
      "Совпадает ли выбранный с найденным:",
      selectedProduct === foundProduct,
    );
  } else {
    console.error("Ошибка: getProductById вернул undefined! Товар не найден.");
  }
} else {
  console.error("Ошибка: В массиве товаров нет ни одного элемента!");
}

console.log("Проверка ProductCatalog завершена!");

const cart = new ShoppingCart();
console.log("Старт тестов ShoppingCart...");

const itemsToAdd = apiProducts.items.slice(0, 3);

if (itemsToAdd.length > 0) {
  itemsToAdd.forEach((item) => {
    cart.addItem(item);
    console.log(`addItem: Товар "${item.title}" добавлен в корзину.`);
  });

  console.log("getCount():", cart.getCount());
  const itemsInCart = cart.getItems();
  console.log(
    "getItems():",
    itemsInCart.length,
    "шт. Состав:",
    itemsInCart.map((i) => i.title),
  );

  const firstProduct = itemsToAdd[0];
  const exists = cart.hasItem(firstProduct.id);
  console.log(
    `hasItem("${firstProduct.title}") до удаления:`,
    exists ? "НАЙДЕН (ВЕРНО)" : "НЕ НАЙДЕН (ОШИБКА)",
  );

  const expectedPrice = itemsToAdd.reduce(
    (sum, item) => sum + (item.price ?? 0),
    0,
  );
  const actualPrice = cart.getTotalPrice();
  console.log(
    "getTotalPrice():",
    actualPrice,
    "(ожидалось:",
    expectedPrice,
    ")",
  );
  console.log(
    "Цена совпадает:",
    actualPrice === expectedPrice
      ? "ВЕРНО"
      : "ОШИБКА — проверь метод getTotalPrice()",
  );

  const productToRemove = itemsToAdd[0];
  cart.removeItem(productToRemove.id);
  console.log(`removeItem: Товар "${productToRemove.title}" удалён.`);

  console.log("getCount() после удаления:", cart.getCount());

  const stillExists = cart.hasItem(productToRemove.id);
  console.log(
    `hasItem("${productToRemove.title}") после удаления:`,
    stillExists ? "НАЙДЕН (ОШИБКА)" : "НЕ НАЙДЕН (ВЕРНО)",
  );

  const remainingItems = cart.getItems();
  console.log(
    "Оставшиеся товары в корзине:",
    remainingItems.length,
    "шт. Состав:",
    remainingItems.map((i) => i.title),
  );

  console.log("clear: Очистка корзины...");
  cart.clear();

  console.log("getCount() после clear:", cart.getCount());
  console.log("getItems().length после clear:", cart.getItems().length);

  const anyProduct = itemsToAdd[itemsToAdd.length - 1];
  const afterClearExists = cart.hasItem(anyProduct.id);
  console.log(
    `hasItem("${anyProduct.title}") после clear:`,
    afterClearExists ? "НАЙДЕН (ОШИБКА)" : "НЕ НАЙДЕН (ВЕРНО)",
  );

  console.log("Все тесты ShoppingCart пройдены успешно!");
} else {
  console.error(
    "Ошибка: Нет товаров для добавления в корзину. Сначала загрузите каталог.",
  );
}

const buyer = new BuyerData();
console.log("Старт тестов BuyerData...");

const filledData = buyer.getData();
console.log("getData() (заполненные):", filledData);

console.log("email:", filledData.email !== "");
console.log("phone:", filledData.phone !== "");
console.log("address:", filledData.address !== "");
console.log("payment:", filledData.payment !== null);

buyer.clearData();
const clearedData = buyer.getData();
console.log("getData() (после clearData):", clearedData);

console.log("email пуст:", clearedData.email === "");
console.log("phone пуст:", clearedData.phone === "");
console.log("address пуст:", clearedData.address === "");
console.log("payment null:", clearedData.payment === null);

buyer.clearData();

const validationErrors = buyer.validate();
console.log("validate() (на пустых данных):", validationErrors);

if (Object.keys(validationErrors).length > 0) {
  console.log(
    "Ошибки присутствуют (ВЕРНО для пустых данных):",
    Object.keys(validationErrors),
  );
} else {
  console.log("Ошибок нет (НЕВЕРНО для пустых данных)");
}

buyer.updateData({
  email: "n@mail.com",
  phone: "+79999999999",
  address: "Первая ул",
  payment: "card",
});

const validationErrorsFilled = buyer.validate();
console.log("validate() (на заполненных данных):", validationErrorsFilled);

if (Object.keys(validationErrorsFilled).length === 0) {
  console.log("Ошибок нет (ВЕРНО для заполненных данных)");
} else {
  console.log("Есть ошибки на валидных данных (ОШИБКА)");
}

console.log("Все тесты BuyerData пройдены успешно!");

const api = new Api(API_URL);
const dataService = new DataService(api);

async function testLoad() {
  try {
    console.log("Отправляем запрос...");
    const response = await dataService.loadProducts();

    console.log("Сырой ответ сервера:", response);

    if (!response || !response.items) {
      console.error("Ошибка структуры ответа. Нет поля items.");
      return;
    }

    const products = response.items;
    catalog.saveProducts(products);

    console.log("Товары сохранены!");
    console.log("Список:", catalog.getProducts());
    console.log("Количество:", catalog.getProducts().length);
  } catch (error) {
    console.error("Ошибка сети:", error);
  }
}

(async () => {
  console.log("Старт выполнения...");
  await testLoad();
})();
