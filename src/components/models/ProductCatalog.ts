import { IProduct } from "../../types";
import { IEvents } from "../base/Events";

export class ProductCatalog {
  private products: IProduct[] = [];
  private selectedProduct: IProduct | null = null;

  constructor(protected events: IEvents) {}

  setProducts(list: IProduct[]) {
    this.products = list;
    this.events.emit("catalog:changed");
  }

public getProducts(): IProduct[] {
  return this.products;
}
public getProductById(id: string): IProduct | undefined {
  return this.products.find(product => product.id === id);
}
setSelectedProduct(item: IProduct) {
    this.selectedProduct = item;
    this.events.emit("product:changed");
  }
public getSelectedProduct(): IProduct | null {
  return this.selectedProduct;
}
}