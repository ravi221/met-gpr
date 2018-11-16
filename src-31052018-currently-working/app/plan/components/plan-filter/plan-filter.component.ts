import {AutoSearchComponent} from '../../../ui-controls/components/auto-search/auto-search.component';
import {Component, Input, OnDestroy, OnInit, QueryList, ViewChildren} from '@angular/core';
import {CustomerStructureDataService} from '../../../customer/services/customer-structure-data.service';
import {FilterService} from '../../../core/services/filter.service';
import {ICustomerStructureRequest} from '../../../customer/interfaces/iCustomerStructureRequest';
import {ICustomerStructure} from '../../../customer/interfaces/iCustomerStructure';
import {ICustomer} from '../../../customer/interfaces/iCustomer';
import {Observable} from 'rxjs/Observable';
import {PlanFilterContextTypes} from '../../enums/plan-filter-context';
import {PlanFilterService} from '../../services/plan-filter.service';
import {SubscriptionManager} from '../../../core/utilities/subscription-manager';
import {Subscription} from 'rxjs/Subscription';
import {isNil} from 'lodash';

/**
 * A component to filter plans on the GPR Customer Home Page
 */
@Component({
  selector: 'gpr-plan-filter',
  template: `
    <section class="plan-filter">
      <!-- Plan Name -->
      <div class="filter">
        <label class="filter-label">Plan Name</label>
        <input type="text"
               class="filter-value filter-plan-name"
               [(ngModel)]="filter.planName"
               placeholder="Enter a plan name">
      </div>

      <!-- Experience -->
      <div class="filter">
        <label class="filter-label">Experience</label>
        <gpr-auto-search class="filter-value"
                         [isAsync]="false"
                         [getRemoteData]="getData.experience"
                         [formatDataFunction]="formatter"
                         [minSearchLength]="1"
                         (onItemSelected)="onExperienceSelected($event)"
                         placeholderText="Type an experience number"></gpr-auto-search>
      </div>

      <!-- Report -->
      <div class="filter" [hidden]="!showAutoSearch.report">
        <label class="filter-label">Report</label>
        <gpr-auto-search class="filter-value"
                         [isAsync]="false"
                         [getRemoteData]="getData.report"
                         [formatDataFunction]="formatter"
                         [minSearchLength]="1"
                         (onItemSelected)="onReportSelected($event)"
                         placeholderText="Type a report number"></gpr-auto-search>
      </div>

      <!-- Sub Codes -->
      <div class="filter" [hidden]="!showAutoSearch.subCode">
        <label class="filter-label">Sub Code</label>
        <gpr-auto-search class="filter-value"
                         [isAsync]="false"
                         [getRemoteData]="getData.subCode"
                         [formatDataFunction]="formatter"
                         [minSearchLength]="1"
                         (onItemSelected)="onSubCodeSelected($event)"
                         placeholderText="Type a sub code"></gpr-auto-search>
      </div>

      <!-- Claim Branches -->
      <div class="filter" [hidden]="!showAutoSearch.claimBranch">
        <label class="filter-label">Claim Branch</label>
        <gpr-auto-search class="filter-value"
                         [isAsync]="false"
                         [getRemoteData]="getData.claimBranch"
                         [formatDataFunction]="formatter"
                         [minSearchLength]="1"
                         (onItemSelected)="onClaimBranchSelected($event)"
                         placeholderText="Type a claim branch"></gpr-auto-search>
      </div>

      <footer class="plan-filter-footer">
        <button class="btn btn-tertiary" (click)="handleCancel()">Cancel</button>
        <button class="btn btn-secondary" (click)="handleApply()">APPLY FILTERS</button>
      </footer>
    </section>
  `,
  styleUrls: ['./plan-filter.component.scss']
})
export class PlanFilterComponent implements OnInit, OnDestroy {

  /**
   * The customer to fetch structure from
   */
  @Input() customer: ICustomer;

  /**
   * The context where this filter will be applied
   */
  @Input() context: PlanFilterContextTypes = PlanFilterContextTypes.CUSTOMER_HOME_PAGE;

  /**
   * The auto search components
   */
  @ViewChildren(AutoSearchComponent) autoSearchComponents: QueryList<AutoSearchComponent>;

  /**
   * The filter object holding the plan name and plan ids
   */
  public filter = {
    planName: null,
    planIds: null,
    context: PlanFilterContextTypes.CUSTOMER_HOME_PAGE
  };

  /**
   * The current filter data for experience
   * Formatter to change the structure information into auto search result items
   */
  public formatter = this._planFilterService.formatStructure.bind(this._planFilterService);

  /**
   * Service calls to filter experience, report, sub code, and claim branch
   */
  public getData = {
    experience: this.getExperience.bind(this),
    report: this.getReport.bind(this),
    subCode: this.getSubCode.bind(this),
    claimBranch: this.getClaimBranch.bind(this)
  };

  /**
   * Object to indicate which auto search components to display
   */
  public showAutoSearch = {
    report: false,
    subCode: false,
    claimBranch: false
  };

  /**
   * Holds the request information when getting structure
   */
  private _customerStructureRequest: ICustomerStructureRequest;

  /**
   * The current data to filter through
   */
  private _data = {
    experiences: null,
    reports: null,
    subCodes: null,
    claimBranches: null
  };

  /**
   * A list of subscriptions to get structure information for a customer
   */
  private _customerStructureSubscriptions: Subscription[] = [];

  /**
   * Creates the plan filter component
   * @param {CustomerStructureDataService} _customerStructureDataService
   * @param {FilterService} _filterService
   * @param {PlanFilterService} _planFilterService
   */
  constructor(private _customerStructureDataService: CustomerStructureDataService,
    private _filterService: FilterService,
    private _planFilterService: PlanFilterService) {
  }

  /**
   * On init, subscribe to get the experience information for this customer
   */
  ngOnInit(): void {
    const customerNumber = this.customer.customerNumber;
    this._customerStructureRequest = {customerNumber};
    const subscription = this._getStructureInformation().subscribe(structures => {
      this._data.experiences = [...structures];
      if (subscription) {
        subscription.unsubscribe();
      }
    });
    this._customerStructureSubscriptions.push(subscription);
    this.filter.context = this.context;
  }

  /**
   * On destroy, reset the filters and unsubscribe from any subscriptions
   */
  ngOnDestroy(): void {
    SubscriptionManager.massUnsubscribe(this._customerStructureSubscriptions);
  }

  /**
   * Filters the experiences by the experience number
   * @param {string} experience
   * @returns {Observable<any>}
   */
  public getExperience(experience: string): Observable<any> {
    return this._filterStructure(this._data.experiences, experience);
  }

  /**
   * Filters the reports by report number
   * @param {string} report
   * @returns {Observable<any>}
   */
  public getReport(report: string): Observable<any> {
    return this._filterStructure(this._data.reports, report);
  }

  /**
   * Filters the sub codes by sub code
   * @param {number} subCode
   * @returns {Observable<any>}
   */
  public getSubCode(subCode: string): Observable<any> {
    return this._filterStructure(this._data.subCodes, subCode);
  }

  /**
   * Filters the claim branches by claim branch
   * @param {number} claimBranch
   * @returns {Observable<any>}
   */
  public getClaimBranch(claimBranch: string): Observable<any> {
    return this._filterStructure(this._data.claimBranches, claimBranch);
  }

  /**
   * Applies the filter when the apply filters is clicked
   */
  public handleApply(): void {
    this._filterService.setFilters(this.filter);
  }

  /**
   * Handles when the cancel button is clicked, resetting the filters and auto searches
   */
  public handleCancel(): void {
    this.filter.planName = null;
    this.filter.planIds = null;
    this.showAutoSearch = this._showAutoSearch('');
    this._resetAutoSearches(-1);
    this._filterService.setFilters(this.filter);
  }

  /**
   * Event when an experience is selected
   * @param experience
   */
  public onExperienceSelected(experience: any): void {
    this._customerStructureRequest.experience = experience.value;
    this._customerStructureRequest.report = undefined;
    this._customerStructureRequest.subCode = undefined;
    const subscription = this._getStructureInformation().subscribe(structures => {
      this._data.reports = [...structures];
      this.showAutoSearch = this._showAutoSearch('report');
      this._resetAutoSearches(0);
      this.filter.planIds = experience.planIds;
      if (subscription) {
        subscription.unsubscribe();
      }
    });
    this._customerStructureSubscriptions.push(subscription);
  }

  /**
   * Event when a report is selected
   * @param report
   */
  public onReportSelected(report: any): void {
    this._customerStructureRequest.report = report.value;
    this._customerStructureRequest.subCode = undefined;
    const subscription = this._getStructureInformation().subscribe(structures => {
      this._data.subCodes = [...structures];
      this.showAutoSearch = this._showAutoSearch('subCode');
      this._resetAutoSearches(1);
      this.filter.planIds = report.planIds;
      if (subscription) {
        subscription.unsubscribe();
      }
    });
    this._customerStructureSubscriptions.push(subscription);
  }

  /**
   * Event when a sub code is selected
   * @param subCode
   */
  public onSubCodeSelected(subCode: any): void {
    this._customerStructureRequest.subCode = subCode.value;
    const subscription = this._getStructureInformation().subscribe(structures => {
      this._data.claimBranches = [...structures];
      this.showAutoSearch = this._showAutoSearch('claimBranch');
      this._resetAutoSearches(2);
      this.filter.planIds = subCode.planIds;
      if (subscription) {
        subscription.unsubscribe();
      }
    });
    this._customerStructureSubscriptions.push(subscription);
  }

  /**
   * Event when a claim branch is selected
   * @param claimBranch
   */
  public onClaimBranchSelected(claimBranch: any): void {
    this.filter.planIds = claimBranch.planIds;
  }

  /**
   * Gets the structure information, given the customer structure request
   * @private
   */
  private _getStructureInformation(): Observable<ICustomerStructure[]> {
    return this._customerStructureDataService.getStructure(this._customerStructureRequest);
  }
  /**
   * Filters the structure
   * @param {ICustomerStructure[]} structures
   * @param {string} value
   * @returns {Observable<any>}
   * @private
   */
  private _filterStructure(structures: ICustomerStructure[], value: string): Observable<ICustomerStructure[]> {
    if (isNil(structures)) {
      return Observable.of([]);
    }
    return Observable.of(structures.filter(s => s.value.indexOf(value) > -1));
  }
  /**
   * Resets the auto search components, starting at a specific index
   * @param {number} index
   * @private
   */
  private _resetAutoSearches(index: number): void {
    this.autoSearchComponents.forEach((autoSearch, idx) => {
      if (idx > index) {
        autoSearch.reset();
      }
    });
  }
  /**
   * Updates the auto search components' visibility based on a string passed in
   * @param {string} structure
   * @private
   */
  private _showAutoSearch(structure: string): any {
    const isReportStructure = structure === 'report';
    if (isReportStructure) {
      return {
        report: true,
        subCode: false,
        claimBranch: false
      };
    }
    const isSubCodeStructure = structure === 'subCode';
    if (isSubCodeStructure) {
      return {
        report: true,
        subCode: true,
        claimBranch: false
      };
    }
    const isClaimBranchStructure = structure === 'claimBranch';
    if (isClaimBranchStructure) {
      return {
        report: true,
        subCode: true,
        claimBranch: true
      };
    }
    return {
      report: false,
      subCode: false,
      claimBranch: false
    };
  }
}

