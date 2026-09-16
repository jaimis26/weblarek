import { IBuyer, TPayment } from "../../types";
import { IEvents } from "../base/Events";

type BuyerValidationErrors = Partial<Record<keyof IBuyer, string>>;

export class BuyerData {
  private payment: TPayment | null = null;
  private email: string = "";
  private phone: string = "";
  private address: string = "";

  constructor(private events: IEvents) {}

  setPayment(payment: TPayment) {
    this.payment = payment;
    this.events.emit("buyer:changed");
  }

  setEmail(email: string) {
    this.email = email;
     this.events.emit("buyer:changed");
  }

  setPhone(phone: string) {
    this.phone = phone;
    this.events.emit("buyer:changed");
  }

  setAddress(address: string) {
    this.address = address;
    this.events.emit("buyer:changed");
  }

  getBuyerData(): IBuyer {
    return {
      payment: this.payment,
      email: this.email,
      phone: this.phone,
      address: this.address,
    };
  }

  clearBuyerData() {
    this.payment = null;
    this.email = "";
    this.phone = "";
    this.address = "";
    this.events.emit("buyer:changed");
  }
  
  public updateData(data: Partial<IBuyer>): void {
    if (data.payment !== undefined) {
      this.payment = data.payment;
    }
    if (data.email !== undefined) {
      this.email = data.email;
    }
    if (data.phone !== undefined) {
      this.phone = data.phone;
    }
    if (data.address !== undefined) {
      this.address = data.address;
    }
  }

  public validate(): BuyerValidationErrors {
  const errors: BuyerValidationErrors = {};
    if (this.payment === null) {
      errors.payment = "Не выбран вид оплаты";
    }
    if (this.email.length === 0) {
      errors.email = "Укажите email";
    }
    if (this.phone.length === 0) {
      errors.phone = "Укажите номер телефона";
    }
    if (this.address.length === 0) {
      errors.address = "Укажите адрес доставки";
    }
    return errors;
  }
}
