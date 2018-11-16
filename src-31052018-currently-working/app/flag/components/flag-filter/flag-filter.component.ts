import {Component, Input, OnDestroy, OnInit, QueryList, ViewChildren} from '@angular/core';
import {CustomerDataService} from '../../../customer/services/customer-data.service';
import {ICustomer} from '../../../customer/interfaces/iCustomer';
import {Observable} from 'rxjs/Observable';
import {AutoSearchComponent} from '../../../ui-controls/components/auto-search/auto-search.component';
import { IFlagFilter } from '../../interfaces/iFlagFilter';
import { FlagFilterService } from '../../services/flag-filter.service';
import { IFlagsRequest } from 'app/flag/interfaces/iFlagsRequest';
import { FlagService } from 'app/flag/services/flag.service';
import { IFlaggedPlan } from 'app/flag/interfaces/iFlaggedPlan';
import { Subscription } from 'rxjs/Subscription';

/**
 * A component to filter plans on the GPR Customer Home Page
 */
@Component({
  selector: 'gpr-flag-filter',
  template: `
    <section class="flag-filter">
      <!-- Plan Name -->
      <div class="filter">
        <label class="filter-label">Plan Name</label>
        <input type="text"
               class="filter-value filter-plan-name"
               [(ngModel)]="filter.planName"
               placeholder="Enter a plan name">
      </div>

      <!-- Status -->
      <div class="filter">
        <label class="filter-label">Status</label>
        <input type="text"
               class="filter-value filter-status"
               [(ngModel)]="filter.status"
               placeholder="Enter a status">
      </div>

      <footer class="flag-filter-footer">
        <button class="btn btn-tertiary" (click)="handleCancel()">Cancel</button>
        <button class="btn btn-secondary" (click)="handleApply()">APPLY FILTERS</button>
      </footer>
    </section>
  `,
  styleUrls: ['./flag-filter.component.scss']
})
export class FlagFilterComponent implements OnInit, OnDestroy {

  /**
   * The customer number to get experience for
   */
  @Input() customer: ICustomer;

  /**
   * Subscription to form state changes.
   */
  private _subscription: Subscription;

  /**
   * The filter object holding the plan name and status
   */
  public filter: IFlagFilter = {
    planName: '',
    status: null
  };

  /**
   * The current filter data for experience
   * @private
   */
  private _flagFilterData = {
    plans: null
  };

  /**
   * flag request
   * @private
   */
  private _flagRequest: IFlagsRequest = {
    customerNumber: null,
    isResolved: '',
    planId: ''
  };

  /**
   * Creates the plan filter component
   * @param {CustomerDataService} _customerDataService
   * @param {FlagFilterService} _flagFilterService
   * @param {FlagService} _flagService
   */
  constructor(private _customerDataService: CustomerDataService,
              private _filterService: FlagFilterService,
              private _flagService: FlagService) {
  }

  /**
   * On init, subscribe to get the plan flag information for this customer
   */
  ngOnInit() {
    this._flagRequest.customerNumber = this.customer.customerNumber;
    this._subscription = this._flagService.getPlansWithFlags(this._flagRequest).subscribe((plans) => {
      this._flagFilterData.plans = plans;
    });
  }

  /**
   * On destroy, reset the filters
   */
  ngOnDestroy(): void {
    this.filter.planName = '';
    this.filter.status = null;
    this._filterService.setFlagFilters(this.filter);
    this._subscription.unsubscribe();
  }

  /**
   * Applies the filter when the apply filters is clicked
   */
  public handleApply(): void {
    this._filterService.setFlagFilters(this.filter);
  }

  /**
   * Used when Removes any filters
   */
  public handleCancel(): void {
    this.filter.planName = '';
    this.filter.status = false;
    this._filterService.setFlagFilters(this.filter);
  }
}
