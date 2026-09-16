import { ensureElement } from "../../utils/utils";
import { categoryMap } from "../../utils/constants";
import { Card, ICard, ICardActions } from "./Card";

export interface ICardCatalog extends ICard {
  category: string;
  image: string;
}

export class Catalog extends Card<ICardCatalog> {
  protected categoryElement: HTMLElement;
  protected imageElement: HTMLImageElement;

  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container)
    
    this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);
    this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);

    if(actions?.onClick) {
      this.container.addEventListener('click', actions.onClick)
    }
  }
  set category(value: string) {
    const el = this.categoryElement;
    Object.values(categoryMap).forEach(cls => el.classList.remove(cls));
    const cssClass = categoryMap[value as keyof typeof categoryMap] ?? 'card__category_other';
    el.classList.add(cssClass);
    el.textContent = value;
  }
  set image(value: string) {
    this.imageElement.src = value;
}
}