import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import {debounceTime, distinctUntilChanged, switchMap} from 'rxjs/operators';

import {isArray} from 'util';
import {Subscription} from 'rxjs/Subscription';
import {KeyboardEventCodes} from 'app/ui-controls/enums/keyboard-event-codes';
import {IAutoSearchResultItem} from 'app/ui-controls/interfaces/iAutoSearchResultItem';
import {isNil} from 'lodash';
import {SubscriptionManager} from '../../../core/utilities/subscription-manager';
/**
 * An auto search component to give users a drop down of selections as they type
 */
@Component({
  selector: 'gpr-auto-search',
  template: `
    <div class="input-field">
      <input class="autoSearch validate filter-input"
             type="text"
             [placeholder]="placeholderText"
             [(ngModel)]="query"
             (keyup)="search($event)"/>
    </div>
    <div (mouseenter)="onMouseEnter()" class="suggestions" [hidden]="filteredList.length === 0"
    gprScroll (scrollAtBottom)="onScrollAtBottom()">
      <ul class="auto-complete-results" *ngFor="let item of filteredList;let idx = index">
        <li [class.complete-selected]="idx === selectedIdx">
          <a (click)="select(item)">
            <span class="auto-search-item-title">{{item.title}}</span>
            <span *ngIf="item.subtitle" class="auto-search-item-subtitle"><br/>{{item.subtitle}}</span>
          </a>
        </li>
      </ul>
    </div>
  `,
  styleUrls: ['./auto-search.component.scss']
})
export class AutoSearchComponent implements OnInit, OnDestroy {

  /**
   * Placeholder text to show before user types into search box
   * @type string
   */
  @Input() placeholderText: string = '';

  /**
   * Service call used to auto search
   */
  @Input() getRemoteData: (data: string, page?: number) => Observable<any>;

  /**
   * Method to call to format data into IAutoSearchResultItem array after service returns it
   */
  @Input() formatDataFunction: (data: any) => Array<IAutoSearchResultItem>;

  /**
   * Indicates if the call being made is asynchronous, used to determine if we need distinct until changed
   * @type {boolean}
   */
  @Input() isAsync: boolean = true;

  /**
   * The minmum number of characters to search by
   * @type {number}
   */
  @Input() minSearchLength: number = 2;

  /**
   * Event emitter that gets called when a user selects an item from results
   */
  @Output() onItemSelected: EventEmitter<any> = new EventEmitter<any>();

  /**
   * Variable used to store what the user has typed
   * @type string
   */
  public query: string = '';

  /**
   * Array of items returned from service call to display to UI
   * @type Array
   */
  public filteredList: IAutoSearchResultItem[] = [];

  /**
   * Used as a "proxy" so multiple api calls aren't made
   * @type Subject<string>
   */
  public searchTerms = new Subject<string>();

  /**
   * Observable used to get return values from service call
   * @type Observable
   */
  public searchResultsObservable: Observable<any>;

  /**
   * Used to maintain index in results list so that the keyboard can be used to select an item
   * @type number
   */
  public selectedIdx: number = -1;

  /**
   * Used to maintain current page of data requested from service
   * @type number
   */
  public currentPage: number = 1;

  /**
   * Variable used to hold onto subscription to data service
   */
  private _serviceSubscription: Subscription;

  /**
   * On init, setup the component
   */
  ngOnInit(): void {
    this.searchResultsObservable = this._getSearchObservable();
    this._serviceSubscription = this.searchResultsObservable
      .map(data => this.formatDataFunction(data))
      .subscribe((data: IAutoSearchResultItem[]) => {
        this.filteredList = [];
        this.currentPage = 1;
        if (data && isArray(data)) {
          this.filteredList = data;
        }
      });
  }

  /**
   * On destroy, unsubscribe from the service call
   */
  ngOnDestroy(): void {
    if (this._serviceSubscription) {
      this._serviceSubscription.unsubscribe();
    }
  }

  /**
   * Method that handles the searching while user is typing into search box
   * @param event contains the key pressed by the user
   */
  public search(event: any): void {
    this.currentPage = 1;
    if (this.query.length >= this.minSearchLength) {
      this.searchTerms.next(this.query);
      this._handleArrowKeyNavigation(event);
    } else {
      this.filteredList = [];
    }
  }

  /**
   * Called when a user selects an item from the search results
   * @param item item selected by user
   */
  public select(item: IAutoSearchResultItem): void {
    this.query = item.title;
    this.filteredList = [];
    this.selectedIdx = -1;
    this.currentPage = 1;
    if (item) {
      this.onItemSelected.emit(item.model);
    }
  }

  /**
   * Called when the mouse enters an item
   */
  public onMouseEnter(): void {
    this.selectedIdx = -1;
  }

  /**
   * Resets the auto search
   */
  public reset(): void {
    this.selectedIdx = -1;
    this.filteredList = [];
    this.query = '';
    this.currentPage = 1;
  }

  /**
   * Listens to the scroll event to potentially load more data
   */
  public onScrollAtBottom(): void {
    this.currentPage++;
    const remoteCallSubscription = this.getRemoteData(this.query, this.currentPage)
      .map(data => this.formatDataFunction(data))
      .subscribe((data: IAutoSearchResultItem[]) => {
        if (isNil(this.filteredList)) {
          this.filteredList = [];
        }
        if (data && isArray(data)) {
          this.filteredList = this.filteredList.concat(data);
        }
        SubscriptionManager.massUnsubscribe([remoteCallSubscription]);
      }, error => {
        SubscriptionManager.massUnsubscribe([remoteCallSubscription]);
      }
        , () => {
          SubscriptionManager.massUnsubscribe([remoteCallSubscription]);
        });
  }

  /**
   * Gets the search observable based on if the auto search is async or not
   * @returns {Observable<string>}
   * @private
   */
  private _getSearchObservable(): Observable<string> {
    if (this.isAsync) {
      return this.searchTerms.pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((term: string) => this.getRemoteData(term))
      );
    }
    return this.searchTerms.pipe(
      debounceTime(300),
      switchMap((term: string) => this.getRemoteData(term))
    );
  }

  /**
   * Handles when arrow keys are pressed, used to select items
   * @param event
   * @returns {any}
   */
  private _handleArrowKeyNavigation(event: any): any {
    if (event.code === KeyboardEventCodes.ARROW_DOWN && this.selectedIdx < this.filteredList.length - 1) {
      this.selectedIdx++;
    } else if (event.code === KeyboardEventCodes.ARROW_UP && this.selectedIdx > 0) {
      this.selectedIdx--;
    } else if (event.code === KeyboardEventCodes.ENTER && this.selectedIdx >= 0) {
      this.select(this.filteredList[this.selectedIdx]);
    }
  }
}
