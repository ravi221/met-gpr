import {Component, Input, OnInit} from '@angular/core';
import {ICustomer} from '../../../../customer/interfaces/iCustomer';
import {NavigatorService} from '../../../services/navigator.service';
import {ISortPreferences} from 'app/core/interfaces/iSortPreferences';
import {isNil} from 'lodash';
import {SortByOption} from '../../../../core/enums/sort-by-option';

/**
 * This component displays a single row in the customers nav menu.
 */
@Component({
  selector: 'gpr-customer-nav-row',
  template: `
    <gpr-nav-row-template
      [title]="customer.customerName"
      [subtitle]="subtitleText"
      [iconName]="'customer'"
      (more)="navigateToCustomer(customer)">
    </gpr-nav-row-template>`,
  styleUrls: []
})
export class CustomerNavRowComponent implements OnInit {

  /**
   * The customer corresponding to this row
   */
  @Input() customer: ICustomer;

  /**
   * Current Sort Option being applied
   */
  @Input() sortPreferences: ISortPreferences;

  /**
   * Subtitle text to display
   */
  public subtitleText: string;


  /**
   * Cosntructor of Customer Nav Row Component
   * @param {NavigatorService} _navigator Navigator service which allows user to load customers
   */
  constructor(private _navigator: NavigatorService) {
  }

  /**
   * Initialized the Customer Nav Row Component
   */
  ngOnInit(): void {
    this.subtitleText = '';
    if (!isNil(this.customer) && !isNil(this.sortPreferences)) {
      if (this.sortPreferences.sortBy === SortByOption.EFFECTIVE_DATE) {
        this.subtitleText = `Effective Date: ${this.customer.effectiveDate}`;
      } else if (this.sortPreferences.sortBy === SortByOption.COMPLETION_PERCENTAGE) {
        this.subtitleText = `${this.customer.percentageCompleted}% Complete`;
      }
    }
  }

  /**
   * Uses the router to navigate to the landing page for the selected customer
   */
  navigateToCustomer(customer: ICustomer): void {
    this._navigator.goToCustomerHome(customer.customerNumber);
  }
}
