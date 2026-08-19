import './scss/styles.scss';
import { ProductCatalog } from './components/models/ProductCatalog';
import { ShoppingCart } from './components/models/ShoppingCart';
import { BuyerData } from './components/models/BuyerData';
import { apiProducts } from './utils/data';
import { Api } from './components/base/Api';
import { DataService } from './components/models/DataService';
import { API_URL } from './utils/constants';

const catalog = new ProductCatalog();
catalog.saveProducts(apiProducts.items);
console.log('Массив товаров из каталога: ', catalog.getProducts()); 

const cart = new ShoppingCart();
cart.addItem(apiProducts.items[0]);
console.log('Массив товаров из корзины: ', cart.getItems()); 

const buyer = new BuyerData();
buyer.updateData({ 
  email: 'n@mail.com', 
  phone: '+79999999999', 
  address: 'Первая ул', 
  payment: 'card' 
});
console.log('Данные покупателя: ', buyer.getData()); 

const api = new Api(API_URL);
const dataService = new DataService(api, catalog, buyer, cart);
async function testLoad() {
  await dataService.loadProducts();
  console.log('Массив товаров из каталога:', catalog.getProducts());
}
testLoad();

