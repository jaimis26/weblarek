import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

export interface GalleryData {
  catalog: HTMLElement;
}

export class Gallery extends Component<GalleryData> {
  protected galleryElement: HTMLElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container)
    
    this.galleryElement = container;
  }
 set catalog(items: HTMLElement[]) {
    this.container.replaceChildren(...items);
  }
}