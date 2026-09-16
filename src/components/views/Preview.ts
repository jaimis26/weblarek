import { ensureElement } from "../../utils/utils";
import { categoryMap } from "../../utils/constants";
import { IEvents } from "../base/Events";
import { Card, ICard } from "./Card";

export interface ICardPreview extends ICard {
  category: string;
  image: string;
  text: string;
}

export class Preview extends Card<ICardPreview> {
  protected imageElement: HTMLImageElement;
  protected categoryElement: HTMLElement;
  protected textElement: HTMLElement;
  protected cardButton: HTMLButtonElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container)

    this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);
    this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);
    this.textElement = ensureElement<HTMLElement>('.card__text', this.container);
    this.cardButton = ensureElement<HTMLButtonElement>('.button.card__button', this.container);

    this.cardButton.addEventListener('click', () => {
      this.events.emit('cardButton:clicked')
    })
  }
  set image(value: string) {
    this.imageElement.src = value;
  }
  set category(value: string) {
    const el = this.categoryElement;
    Object.values(categoryMap).forEach(cls => el.classList.remove(cls));
    const cssClass = categoryMap[value as keyof typeof categoryMap] ?? 'card__category_other';
    el.classList.add(cssClass);
    el.textContent = value;
  }
  set text(value: string) {
    this.textElement.textContent = value;
  }
  set buttonText(value: string) {
    this.cardButton.textContent = value;
  }
  set disableBtn(value: boolean) {
    this.cardButton.disabled = value;
  }
}