import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import {ISearchState} from '../../../interfaces/iSearchState';
import {SearchResultListService} from '../../../services/search-result-list.service';
import {ICustomer} from '../../../../customer/interfaces/iCustomer';
import {ISortOption} from '../../../../core/interfaces/iSortOption';

/**
 * Displays a list of search results
 */
@Component({
  selector: 'gpr-search-result-list',
  template: `
    <div class="search-result-list-container">
      <section>
        <section class="search-result-list"
                 [class.results-bg]="showBackground"
                 gprScroll
                 (scrollAtBottom)="onScrollAtBottom()">
          <gpr-search-attribute-list *ngIf="showLists.attribute"
                                     [attributes]="displayResults"
                                     (attributeDetailsClick)="onAttributeDetailsClick($event)"></gpr-search-attribute-list>
          <gpr-search-attribute-details-list *ngIf="showLists.attributeDetails"
                                             [attributeDetails]="displayResults"></gpr-search-attribute-details-list>
          <gpr-search-customer-list *ngIf="showLists.customer"
                                    [customers]="displayResults"
                                    (customerClick)="onCustomerClick($event)"></gpr-search-customer-list>
          <gpr-search-plan-list *ngIf="showLists.plan"
                                [plans]="displayResults"
                                (planClick)="onPlanClick($event)"></gpr-search-plan-list>
          <gpr-customer-list *ngIf="showLists.user"
                             [canHideCustomers]="false"
                             [customers]="displayResults"
                             (customerSelect)="onCustomerClick($event)"
                             (sortChange)="onSortChange($event)"></gpr-customer-list>
        </section>
        <gpr-loading-icon [show]="isSearchQueued"></gpr-loading-icon>
        <a *ngIf="shouldShowMoreLink && hasMoreResults" class="more-results-link"
           (click)="onShowMoreResultsClick()">{{showMoreLabel}}</a>
      </section>
      <div *ngIf="hasEmptyResults">
        <gpr-icon name="no-search-results"></gpr-icon>
        <span class="no-results-msg">No search results</span>
      </div>
    </div>
  `,
  styleUrls: ['./search-result-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchResultListComponent implements OnInit, OnChanges {

  /**
   * Represents the current search state
   */
  @Input() searchState: ISearchState;

  /**
   * Emits event when an attribute's plans button is clicked
   * @type {EventEmitter<any>}
   */
  @Output() attributeDetailsClick: EventEmitter<any> = new EventEmitter<any>();

  /**
   * Emits a customer when a customer is clicked, emit its customer number
   * @type {EventEmitter<ICustomer>}
   */
  @Output() customerClick: EventEmitter<number> = new EventEmitter<number>();

  /**
   * Emits a plan id when a plan is clicked
   * @type {EventEmitter<ICustomer>}
   */
  @Output() planClick: EventEmitter<string> = new EventEmitter<string>();

  /**
   * Emits event when the show more button is clicked
   * @type {EventEmitter<any>}
   */
  @Output() showMoreResultsClick: EventEmitter<any> = new EventEmitter<any>();

  /**
   * Emits an event to show more results when scrolling
   * @type {EventEmitter<any>}
   */
  @Output() showMoreResultsScroll: EventEmitter<any> = new EventEmitter<any>();

  /**
   * Emits an event when the sort has changed
   * @type {EventEmitter<ISortOption>}
   */
  @Output() sortChange: EventEmitter<ISortOption> = new EventEmitter<ISortOption>();

  /**
   * The actual search results to display in the UI
   * @type {Array}
   */
  public displayResults: any[] = [];

  /**
   * Indicates if to there are results that are empty
   * @type {boolean}
   */
  public hasEmptyResults: boolean = false;


  /** Indicates if to there are additional results to display
   * @type {boolean}
   */
  public hasMoreResults: boolean = false;

  /**
   * Indicates if to a search is queued
   * @type {boolean}
   */
  public isSearchQueued: boolean = false;

  /**
   * Indicates if to show the background when on the search full page
   * @type {boolean}
   */
  public showBackground: boolean = false;

  /**
   * Indicates if to display the show more link
   * @type {boolean}
   */
  public shouldShowMoreLink: boolean = false;

  /**
   * The label for the show more link
   */
  public showMoreLabel: string = '';

  /**
   * Object to indicate which list to display
   */
  public showLists = {
    attribute: false,
    attributeDetails: false,
    customer: false,
    plan: false,
    user: false
  };

  /**
   * Creates the search result list component
   * @param {SearchResultListService} _searchResultListService
   */
  constructor(private _searchResultListService: SearchResultListService) {
  }

  /**
   * On init, setup the search results view
   */
  ngOnInit(): void {
    this._initSearchResults();
  }

  /**
   * On changes, update the search result list based on the search state
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.searchState) {
      this._initSearchResults();
    }
  }

  /**
   * Called when an attribute's plans button is clicked
   * @param attribute
   */
  public onAttributeDetailsClick(attribute: any): void {
    this.attributeDetailsClick.emit(attribute);
  }

  /**
   * Called when a customer is clicked, emit its customer number
   * @param {number} customerNumber
   */
  public onCustomerClick(customerNumber: number): void {
    this.customerClick.emit(customerNumber);
  }

  /**
   * Called when a plan is clicked, emit its plan id
   * @param {string} planId
   */
  public onPlanClick(planId: string): void {
    this.planClick.emit(planId);
  }

  /**
   * Whenever a scroll occurs, potentially load more components
   */
  public onScrollAtBottom(): void {
    if (this.hasMoreResults) {
      this.showMoreResultsScroll.emit();
    }
  }

  /**
   * Function called once the show all results link is clicked
   */
  public onShowMoreResultsClick(): void {
    this.showMoreResultsClick.emit();
  }

  /**
   * Called when the sort changes, used with the user customer list
   * @param {ISortOption} sortOption
   */
  public onSortChange(sortOption: ISortOption): void {
    this.sortChange.emit(sortOption);
  }

  /**
   * Initializes the search results based on the search state
   * @private
   */
  private _initSearchResults(): void {
    const searchState = this.searchState;
    if (!searchState) {
      this.isSearchQueued = true;
      return;
    }
    this.shouldShowMoreLink = this._searchResultListService.shouldShowMoreLink(searchState);
    this.hasEmptyResults = this._searchResultListService.hasEmptyResults(searchState);
    this.hasMoreResults = this._searchResultListService.hasMoreResults(searchState);
    this.showBackground = this._searchResultListService.showBackgroundBySearchState(searchState);
    this.showLists = this._searchResultListService.showListsBySearchState(searchState);
    this.showMoreLabel = this._searchResultListService.getShowMoreLabelBySearchState(searchState);
    this.displayResults = searchState.searchResults.results;
    this.isSearchQueued = searchState.isSearchQueued;
  }
}
