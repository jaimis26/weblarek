import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

export interface IForm {
  valid: boolean;
  errors: string;
}

export class Form<T extends IForm> extends Component<T> {
  protected formErrors: HTMLElement;
  protected submitBtnElement: HTMLButtonElement;

  constructor(container:HTMLFormElement, protected events:IEvents) {
    super(container)

    this.submitBtnElement = ensureElement<HTMLButtonElement>('button[type="submit"]', this.container);
    this.formErrors = ensureElement<HTMLElement>('.form__errors', this.container);
    
    this.container.addEventListener("submit", (event) => {
      event.preventDefault();
      this.events.emit(`${container.name}:submit`);
    });
    this.container.addEventListener("input", (event) => {
      const input = event.target;
      if (input instanceof HTMLInputElement) {
        this.events.emit(`${container.name}:change`, {
          field: input.name,
          value: input.value,
        });
      }
    });
  }
  set errors(value: string) {
    this.formErrors.textContent = value;
  }
  set valid(value: boolean) { 
        this.submitBtnElement.disabled = !value; 
 }
}