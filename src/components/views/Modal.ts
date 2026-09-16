import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

export interface ModalData {
  content: HTMLElement;
}

export class Modal extends Component<ModalData> {
  protected modalElement: HTMLElement;
  protected modalButton: HTMLButtonElement;

  constructor(container: HTMLElement,protected events: IEvents) {
    super(container)

    this.modalElement = ensureElement<HTMLElement>('.modal__content', this.container);
    this.modalButton = ensureElement<HTMLButtonElement>('.modal__close', this.container);

    this.modalButton.addEventListener('click', () => {
      this.close()
    })
    this.container.addEventListener('click', (event) => {
      if(event.target === this.container) {
        this.close()
      }
    })
  }

  set content(value: HTMLElement) {
    this.modalElement.innerHTML = '';
    this.modalElement.appendChild(value);
  }
  open(): void {
  this.container.classList.add('modal_active')
}
  close(): void {
    this.container.classList.remove('modal_active')
  }
}
