import { IProduct } from "../../types";

export class ProductCatalog {
  private products: IProduct[] = [];
  private selectedProduct: IProduct | null = null;

  constructor() {
  }
public saveProducts(products: IProduct[]): void {
    this.products = products;
  }
public getProducts(): IProduct[] {
  return this.products;
}
public getProductById(id: string): IProduct | undefined {
  return this.products.find(product => product.id === id);
}
public setSelectedProduct(product: IProduct): void {
  this.selectedProduct = product;
}
public getSelectedProduct(): IProduct | null {
  return this.selectedProduct;
}
}