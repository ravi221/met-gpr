import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {HistoryFilterService} from '../../services/history-filter.service';
import {ICustomer} from '../../../customer/interfaces/iCustomer';
import {IHistoryFilter} from '../../interfaces/iHistoryFilter';
import {PlanStatus} from '../../../plan/enums/plan-status';
import ChoiceConfig from '../../../forms-controls/config/choice-config';
import {IDatePickerOutput} from 'app/ui-controls/interfaces/iDatePickerOutput';

/**
 * A component to filter history on the GPR History Page
 */
@Component({
  selector: 'gpr-history-filter',
  template: `
    <section class="history-filter">
      <!-- Keyword -->
      <div class="filter">
        <label class="filter-label">Keyword</label>
        <input type="text"
               class="filter-value filter-keyword"
               [(ngModel)]="filter.keyword"
               placeholder="Enter a keyword">
      </div>

      <!-- Username/ID -->
      <div class="filter">
        <label class="filter-label">Username/ID</label>
        <input type="text"
               class="filter-value filter-username"
               [(ngModel)]="filter.userName"
               placeholder="Enter a username/ID">
      </div>

      <!-- Plan Name -->
      <div class="filter">
        <label class="filter-label">Plan Name</label>
        <input type="text"
               class="filter-value filter-plan-name"
               [(ngModel)]="filter.planName"
               placeholder="Enter a plan name">
      </div>

      <!-- Plan Status -->
      <div class="filter">
        <label class="filter-label">Plan Status</label>
        <gpr-drop-down
          [value]="filter.planStatus"
          [choices]="statusChoices"></gpr-drop-down>
      </div>

      <!-- Date Range -->
      <div class="filter">
        <label class="filter-label">Date Range</label>
        <gpr-date-picker
          [shouldAllowInput]="true"
          class="filter-date-range range"
          (dateChanged)="setDateRangeFrom($event)">
        </gpr-date-picker>
        <gpr-date-picker
          [shouldAllowInput]="true"
          class="range"
          (dateChanged)="setDateRangeTo($event)">
        </gpr-date-picker>
      </div>

      <!-- Version Range -->
      <div class="filter">
        <label class="filter-label">Version</label>
        <input type="number"
               class="filter-value filter-version-range range"
               [(ngModel)]="filter.versionFrom">
        <input type="number"
               class="filter-value range"
               [(ngModel)]="filter.versionTo">
      </div>

      <!-- Effective Date -->
      <div class="filter">
        <label class="filter-label">Effective Date</label>
        <gpr-date-picker
          allowInput="true"
          (dateChanged)="setEffectiveDate($event)">
        </gpr-date-picker>
      </div>

      <footer class="history-filter-footer">
        <button class="btn btn-tertiary" (click)="handleCancel()">Cancel</button>
        <button class="btn btn-secondary" (click)="handleApply()">APPLY FILTERS</button>
      </footer>
    </section>
  `,
  styleUrls: ['./history-filter.component.scss']
})
export class HistoryFilterComponent implements OnInit, OnDestroy {
  /**
   * The customer number to get experience for
   */
  @Input() customer: ICustomer;

  /**
   * List of choices for the plan status drop down
   * @type {({label: string; value: string} | {label: PlanStatus; value: PlanStatus})[]}
   */
  public statusChoices: ChoiceConfig[] = [{
    label: '-- Select a Status --',
    value: ''
  }, {
    label: PlanStatus.ACTIVE,
    value: PlanStatus.ACTIVE
  }, {
    label: PlanStatus.TERMINATED,
    value: PlanStatus.TERMINATED
  }, {
    label: PlanStatus.WILL_TERMINATE,
    value: PlanStatus.WILL_TERMINATE
  }, {
    label: PlanStatus.IN_REVISION,
    value: PlanStatus.IN_REVISION
  }];

  /**
   * The filter object based on {@link IHistoryFilter}
   */
  public filter: IHistoryFilter = <IHistoryFilter>{
    keyword: '',
    userName: '',
    planName: '',
    planStatus: null,
    dateRangeFrom: null,
    dateRangeTo: null,
    versionFrom: null,
    versionTo: null,
    effectiveDate: null
  };

  /**
   * Creates the history filter component
   * @param {HistoryFilterService} _historyFilterService
   */
  constructor(private _historyFilterService: HistoryFilterService) {
  }

  /**
   * On init, nothing to do yet
   */
  ngOnInit(): void {

  }

  /**
   * On destroy, reset the filters
   */
  ngOnDestroy(): void {
    this._resetFilters();
  }

  /**
   * Sets the date for the date range from value
   * @param datePickerObject
   */
  public setDateRangeFrom(datePickerObject: IDatePickerOutput): void {
    this.filter.dateRangeFrom = datePickerObject.dateString;
  }

  /**
   * Sets the date for the date range to value
   * @param datePickerObject
   */
  public setDateRangeTo(datePickerObject: IDatePickerOutput): void {
    this.filter.dateRangeTo = datePickerObject.dateString;
  }

  /**
   * Sets the date for the effective date value
   * @param datePickerObject
   */
  public setEffectiveDate(datePickerObject: IDatePickerOutput): void {
    this.filter.effectiveDate = datePickerObject.dateString;
  }

  /**
   * Applies the filter when the apply filters is clicked
   */
  public handleApply(): void {
    this._historyFilterService.setFilters(this.filter);
  }

  /**
   * Used when Removes any filters
   */
  public handleCancel(): void {
    this._resetFilters();
  }

  /**
   * Function to reset the filters
   * @private
   */
  private _resetFilters(): void {
    this.filter.keyword = '';
    this.filter.userName = '';
    this.filter.planName = '';
    this.filter.planStatus = null;
    this.filter.dateRangeTo = null;
    this.filter.dateRangeFrom = null;
    this.filter.versionTo = null;
    this.filter.versionFrom = null;
    this.filter.effectiveDate = null;
    this._historyFilterService.setFilters(this.filter);
  }
}
