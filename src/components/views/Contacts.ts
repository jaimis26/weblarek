import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { Form, IForm } from "./Form";

export interface IContacts extends IForm {
  email: string;
  phone: string;
}

export class Contacts extends Form<IContacts> {
  protected emailElement: HTMLInputElement;
  protected phoneElement: HTMLInputElement;

  constructor(container:HTMLFormElement, protected events: IEvents) {
    super(container, events)
  
    this.emailElement = ensureElement<HTMLInputElement>('[name="email"]', this.container);
    this.phoneElement = ensureElement<HTMLInputElement>('[name="phone"]', this.container);
  }
  set email(value:string) {
    this.emailElement.value = value;
  }
  set phone(value:string) {
    this.phoneElement.value = value;
  }
}