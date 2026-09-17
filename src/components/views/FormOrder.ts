import { TPayment } from "../../types";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { Form, IForm } from "./Form";

export interface IOrder extends IForm {
  payment: TPayment | null;
  address: string;
}

export class FormOrder extends Form<IOrder> {
  protected cardBtn: HTMLButtonElement;
  protected cashBtn: HTMLButtonElement;
  protected adressElement: HTMLInputElement;

  constructor(container:HTMLFormElement, protected events: IEvents) {
    super(container, events)

    this.cardBtn = ensureElement<HTMLButtonElement>('[name="card"]', this.container);
    this.cashBtn = ensureElement<HTMLButtonElement>('[name="cash"]', this.container);
    this.adressElement = ensureElement<HTMLInputElement>('input[name="address"]', this.container);

    this.cardBtn.addEventListener("click", () => {
      this.events.emit("payment:change", { payment: "card" });
    });

    this.cashBtn.addEventListener("click", () => {
      this.events.emit("payment:change", { payment: "cash" });
    });
  }
  set payment(value: TPayment | "") {
  this.cardBtn.classList.remove('button_alt-active');
  this.cashBtn.classList.remove('button_alt-active');

  if (value === 'card') {
    this.cardBtn.classList.add('button_alt-active');
  } else if (value === 'cash') {
    this.cashBtn.classList.add('button_alt-active');
  }
  }
  set adress(value:string) {
    this.adressElement.value = value;
  }
}