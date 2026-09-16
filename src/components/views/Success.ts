import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

export interface SuccessData {
  totalPrice: number;
}

export class SuccessView extends Component<SuccessData> {
  protected descriptionElement: HTMLElement;
  protected successBtn: HTMLButtonElement;

  constructor(container: HTMLElement, protected events: IEvents){
    super(container)

    this.descriptionElement = ensureElement<HTMLElement>('.order-success__description', this.container);
    this.successBtn = ensureElement<HTMLButtonElement>('.button.order-success__close', this.container);
    
    this.successBtn.addEventListener('click', () => {
      this.events.emit('success:close');
    });
  }
  set totalPrice(value: number) {
    this.descriptionElement.textContent = `Списано ${value} синапсов`;
  }
}