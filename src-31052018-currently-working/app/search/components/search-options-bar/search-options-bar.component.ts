import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output} from '@angular/core';
import {SearchChoicesService} from '../../services/search-choices.service';
import {SearchByOptions} from '../../enums/SearchByOptions';
import {SearchForOptions} from '../../enums/SearchForOptions';
import {ISearchState} from '../../interfaces/iSearchState';
import {ISearchChoices} from '../../interfaces/iSearchChoices';
import ChoiceConfig from '../../../forms-controls/config/choice-config';

/**
 * Creates the search options bar, with the following options:
 *
 * Search By : All Customer, This Customer, By User
 * Search For : Plan, Attribute
 *
 * Usage:
 * ```html
 *    <gpr-search-options-bar [searchState]="searchState"
 *                            (searchByOptionChange)="fn()"
 *                            (searchForOptionChange)="fn()"></gpr-search-options-bar>
 * ```
 */
@Component({
  selector: 'gpr-search-options-bar',
  template: `
    <section class="search-options-bar">
      <div class="col-sm-12">
        <label>Search</label>
        <gpr-tabs [choices]="searchByChoices"
                  [value]="searchByValue"
                  [id]="'searchBy'"
                  (choiceChange)="onSearchByChanged($event.value)"></gpr-tabs>
      </div>
      <div class="col-sm-12">
        <label [class.disabled]="isSearchForDisabled">For</label>
        <gpr-tabs [choices]="searchForChoices"
                  [value]="searchForValue"
                  [id]="'searchFor'"
                  (choiceChange)="onSearchForChanged($event.value)"></gpr-tabs>
      </div>
    </section>
  `,
  styleUrls: ['./search-options-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchOptionsBarComponent implements OnChanges {

  /**
   * The search state, used to get the search choices and values
   */
  @Input() searchState: ISearchState;

  /**
   * Emits event with the new search options to search on
   */
  @Output() searchByOptionChange: EventEmitter<SearchByOptions> = new EventEmitter<SearchByOptions>();

  /**
   * Emits event with the new search options to search on
   */
  @Output() searchForOptionChange: EventEmitter<SearchForOptions> = new EventEmitter<SearchForOptions>();

  /**
   * The search by choices
   */
  public searchByChoices: ChoiceConfig[];

  /**
   * The current search by value
   */
  public searchByValue: any;

  /**
   * The search for choices
   */
  public searchForChoices: ChoiceConfig[];

  /**
   * The current search for value
   */
  public searchForValue: any;

  /**
   * Indicates if the search for options are disabled
   */
  public isSearchForDisabled: boolean = false;

  /**
   * Creates the search options bar component
   * @param {SearchChoicesService} _searchChoicesService
   */
  constructor(private _searchChoicesService: SearchChoicesService) {
  }

  /**
   * On changes, update the search choices and values based on the search state
   */
  ngOnChanges(): void {
    if (this.searchState) {
      const searchChoices: ISearchChoices = this._searchChoicesService.getSearchChoicesBySearchState(this.searchState);
      this.searchByChoices = searchChoices.searchByChoices;
      this.searchForChoices = searchChoices.searchForChoices;
      this.searchByValue = this.searchState.searchByOption;
      this.searchForValue = this.searchState.searchForOption;
      this.isSearchForDisabled = this.searchForValue === null;
    }
  }

  /**
   * Called when the search by options change and emits event
   * @param {SearchByOptions} searchByOption
   */
  public onSearchByChanged(searchByOption: SearchByOptions): void {
    this.searchByOptionChange.emit(searchByOption);
  }

  /**
   * Called when the search for options change and emits event
   * @param {SearchForOptions} searchForOption
   */
  public onSearchForChanged(searchForOption: SearchForOptions): void {
    this.searchForOptionChange.emit(searchForOption);
  }
}
