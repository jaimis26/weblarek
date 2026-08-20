import { Api } from "../base/Api";
import { ServerProductsResponse } from "../../types";
import { OrderPayload } from "../../types";
import { OrderResponse } from "../../types";

export class DataService {
  private api: Api;

  constructor(api: Api) {
    this.api = api;
  }

  public async loadProducts(): Promise<ServerProductsResponse> {
    return this.api.get("/product");
  }

  public async sendOrder(payload: OrderPayload): Promise<OrderResponse> {
     return this.api.post("/order/", payload) as Promise<OrderResponse>;
  }
}
