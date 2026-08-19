import { ProductCatalog } from "./ProductCatalog";
import { ShoppingCart } from "./ShoppingCart";
import { BuyerData } from "./BuyerData";
import { Api } from "../base/Api";
import { ServerProductsResponse } from "../../types";
import { OrderPayload } from "../../types";

export class DataService {
  private api: Api;
  private catalog: ProductCatalog;
  private buyer: BuyerData;
  private cart: ShoppingCart;
  
  constructor(
    api: Api, 
    catalog: ProductCatalog, 
    buyer: BuyerData, 
    cart: ShoppingCart
  ) {
    this.api = api;
    this.catalog = catalog;
    this.buyer = buyer;
    this.cart = cart;
  }
public async loadProducts(): Promise<void> {
  const products: ServerProductsResponse = await this.api.get('/product');
  this.catalog.saveProducts(products)
}
public async sendOrder(): Promise<void> {
  const buyerData = this.buyer.getData();
  if(!buyerData) {
     throw new Error('Не заполнены данные покупателя!');
  }
  const items = this.cart.getItems();
  const payload: OrderPayload = {
              buyer: buyerData,
              items: items
            };
  await this.api.post('/order/', payload);
}
}