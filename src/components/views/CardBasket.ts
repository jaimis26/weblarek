import { Card, ICard, ICardActions } from "./Card";
import { ensureElement } from "../../utils/utils";


export interface ICardBasket extends ICard {
  index: number;
}

export class CardBasket extends Card<ICardBasket> {
  protected indexElement: HTMLElement;
  protected basketButton: HTMLButtonElement;

  constructor(container:HTMLElement, actions?: ICardActions) {
    super(container)

    this.indexElement = ensureElement<HTMLElement>('.basket__item-index', this.container);
    this.basketButton = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);

    if (this.basketButton && actions?.onClick) {
      this.basketButton.addEventListener('click', actions.onClick);
    }
  }
  set index(value:number) {
    this.indexElement.textContent = String(value);
  }
  }
