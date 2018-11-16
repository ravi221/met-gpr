import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ICustomer} from '../../../../customer/interfaces/iCustomer';

/**
 * Displays a list of customer search results
 *
 * Usage:
 * ```html
 *    <gpr-search-customer-list-item [customer]="customer"
 *                                   (customerClick)="fn($event)"></gpr-search-customer-list-item>
 * ```
 */
@Component({
  selector: 'gpr-search-customer-list-item',
  template: `
    <gpr-search-result
      [title]="customerTitle"
      [subtitle]="customerSubtitle"
      [icon]="'customer'"
      (searchResultClick)="onSearchResultClick()">
    </gpr-search-result>
  `
})
export class SearchCustomerListItemComponent implements OnInit {

  /**
   * The customer result to display
   */
  @Input() customer: ICustomer;

  /**
   * Event to trigger once a customer is clicked, emitting its customer number
   * @type {EventEmitter<ICustomer>}
   */
  @Output() customerClick: EventEmitter<number> = new EventEmitter<number>();

  /**
   * The customer title, containing the customer's name and number
   * @type {string}
   */
  public customerTitle: string = '';

  /**
   * The subtitle for the customer
   */
  public customerSubtitle: string = '';

  /**
   * On init, initializes the subtitle for the given customer
   */
  ngOnInit(): void {
    this.customerTitle = `${this.customer.customerName} - ${this.customer.customerNumber}`;
    this.customerSubtitle = `Effective: ${this.customer.effectiveDate}, ${this.customer.percentageCompleted}% Complete`;
  }

  /**
   * Function called when the customer is clicked
   */
  public onSearchResultClick(): void {
    const customerNumber = this.customer.customerNumber;
    this.customerClick.emit(customerNumber);
  }
}
