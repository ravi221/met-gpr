import {Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {FormControl} from '@angular/forms';
import {SearchBarService} from '../../services/search-bar.service';
import {SubscriptionManager} from '../../../core/utilities/subscription-manager';
import {Subscription} from 'rxjs/Subscription';

/**
 * Creates a search bar containing a search input field and search button
 *
 * Usage:
 *
 * ```html
 *  <gpr-search-bar [minSearchLength]="2" [delayMs]="2000"></gpr-search-bar> *
 * ```
 */
@Component({
  selector: 'gpr-search-bar',
  template: `
    <section class="search-bar">
      <input type="text"
             class="search-field"
             [value]="searchField"
             [formControl]="searchFieldControl"
             (keyup.enter)="runSearch()"
             [placeholder]="placeholder"
             #searchInput/>
      <button class="btn search-btn" (click)="runSearch()">
        <gpr-icon name="search-selected"></gpr-icon>
      </button>
    </section>
  `,
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent implements OnInit, OnDestroy {

  /**
   * The minimum number of characters required to trigger search, default to 0 characters
   */
  @Input() minSearchLength: number = 0;

  /**
   * The number of milliseconds to delay the search by when typing, default to 0ms
   */
  @Input() delayMs: number = 0;

  /**
   * The place holder for the search bar
   * @type {string}
   */
  @Input() placeholder: string = '';

  /**
   * Event emitter to send search criteria to parent component
   */
  @Output() searchTriggered: EventEmitter<string> = new EventEmitter<string>();

  /**
   * Event emitter to update when the search field is changed
   * @type {EventEmitter<string>}
   */
  @Output() searchTyped: EventEmitter<string> = new EventEmitter<string>();

  /**
   * The search string to perform a search on
   */
  public searchField: string = '';

  /**
   * A form control for handling changes to the search field
   * @type {FormControl}
   */
  public searchFieldControl = new FormControl();

  /**
   * The input element
   */
  @ViewChild('searchInput') private _searchInput: ElementRef;

  /**
   * A subscription to the search bar service
   */
  private _searchBarSubscription: Subscription;

  /**
   * A subscription to watch any changes to the search field, regardless of timing
   */
  private _searchChangeSubscription: Subscription;

  /**
   * A subscription to watch the debounced changes to search field
   */
  private _searchDebounceSubscription: Subscription;

  /**
   * The default constructor.
   */
  constructor(private _searchBarService: SearchBarService) {
  }

  /**
   * On init, setup subscriptions to watch changes to search field
   */
  ngOnInit(): void {
    this._searchBarSubscription = this._searchBarService.focus$.subscribe(() => {
      this._searchInput.nativeElement.focus();
    });

    this._searchChangeSubscription = this.searchFieldControl.valueChanges
      .subscribe(newSearchField => {
        this.searchTyped.emit(newSearchField);
      });

    this._searchDebounceSubscription = this.searchFieldControl.valueChanges
      .debounceTime(this.delayMs)
      .subscribe(newSearchField => {
        this._triggerSearch(newSearchField);
      });
  }

  /**
   * On destroy, unsubscribe from all subscriptions
   */
  ngOnDestroy(): void {
    const subscriptions: Subscription[] = [
      this._searchBarSubscription,
      this._searchChangeSubscription,
      this._searchDebounceSubscription
    ];
    SubscriptionManager.massUnsubscribe(subscriptions);
  }

  /**
   * Triggered when the user clicks the search button, used to immediately send search
   */
  public runSearch(): void {
    this._triggerSearch(this.searchFieldControl.value);
  }

  /**
   * Checks to make sure the search is valid
   */
  public isValidSearch(searchField: string): boolean {
    return searchField.length >= this.minSearchLength;
  }

  /**
   * Triggers the search if valid
   */
  private _triggerSearch(newSearchField: string): void {
    if (!this.isValidSearch(newSearchField)) {
      return;
    }
    this.searchTriggered.emit(newSearchField);
  }
}
