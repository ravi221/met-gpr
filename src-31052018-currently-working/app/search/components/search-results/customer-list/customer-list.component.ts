import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ICustomer} from '../../../../customer/interfaces/iCustomer';

/**
 * Displays a list of customer search results
 *
 * Usage:
 * ```html
 *    <gpr-search-customer-list [customers]="customers"
 *                              (customerClick)="fn($event)"></gpr-search-customer-list>
 * ```
 */
@Component({
  selector: 'gpr-search-customer-list',
  template: `
    <div class="search-customer-list">
      <gpr-search-customer-list-item *ngFor="let customer of customers"
                                     [customer]="customer"
                                     (customerClick)="onCustomerClick($event)"></gpr-search-customer-list-item>
    </div>
  `
})
export class SearchCustomerListComponent {

  /**
   * The customers to display on screen
   */
  @Input() customers: ICustomer[] = [];

  /**
   * Emits a customer when clicked, emitting its customer number
   * @type {EventEmitter<ICustomer>}
   */
  @Output() customerClick: EventEmitter<number> = new EventEmitter<number>();

  /**
   * The default constructor.
   */
  constructor() {
  }

  /**
   * When the customer is clicked, emit this customer
   * @param {number} customerNumber
   */
  public onCustomerClick(customerNumber: number): void {
    this.customerClick.emit(customerNumber);
  }
}
