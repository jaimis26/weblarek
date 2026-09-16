import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

export interface BasketData {
  list: HTMLElement[];
  price: number;
}

export class Basket extends Component<BasketData> {
  protected basketList: HTMLElement;
  protected basketButton: HTMLButtonElement;
  protected basketPrice: HTMLElement;

  constructor(protected events: IEvents, container: HTMLElement) {
    super(container)

    this.basketList = ensureElement<HTMLElement>('.basket__list', this.container);
    this.basketButton = ensureElement<HTMLButtonElement>('.button.basket__button', this.container);
    this.basketPrice = ensureElement<HTMLElement>('.basket__price', this.container);

    this.basketButton.addEventListener('click', () => {
            this.events.emit('basket:order')
        })
  }
  set price(value: number) {
    this.basketPrice.textContent = `${value} синапсов`;
  }
  set list(value: HTMLElement[]) {
     this.basketList.replaceChildren(...value);
  }
  set isDisabled(value: boolean) {
        this.basketButton.disabled = value;
    }
}