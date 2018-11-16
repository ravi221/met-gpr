import {Injectable} from '@angular/core';
import {SearchByOptions} from '../enums/SearchByOptions';
import {SearchForOptions} from '../enums/SearchForOptions';
import {NavContextType} from '../../navigation/enums/nav-context';
import {ISearchChoices} from '../interfaces/iSearchChoices';
import {ISearchState} from '../interfaces/iSearchState';
import ChoiceConfig from '../../forms-controls/config/choice-config';
import StateConfig from '../../forms-controls/config/state-config';

/**
 * A service used for getting which search choices to enable/disable, as well as store
 * the current selected values for search by and search for
 */
@Injectable()
export class SearchChoicesService {

  /**
   * An array of ChoiceConfigs to represent the search by options
   */
  private _searchByChoices: ChoiceConfig[];

  /**
   * An array of ChoiceConfigs to represent the search for options
   */
  private _searchForChoices: ChoiceConfig[];

  /**
   * Creates the search choices service
   */
  constructor() {
    this._searchByChoices = this._createSearchOptionsChoices([
      SearchByOptions.ALL_CUSTOMERS,
      SearchByOptions.THIS_CUSTOMER,
      SearchByOptions.BY_USER
    ]);
    this._searchByChoices[1].state.isDisabled = true;

    this._searchForChoices = this._createSearchOptionsChoices([
      SearchForOptions.PLAN,
      SearchForOptions.ATTRIBUTE
    ]);
  }

  /**
   * Gets the search choices based on the search state
   * @param {ISearchState} searchState
   * @returns {ISearchChoices}
   */
  getSearchChoicesBySearchState(searchState: ISearchState): ISearchChoices {
    const searchByChoices = this._getSearchByChoices(searchState.navContext);
    const searchForChoices = this._getSearchForChoices(searchState.searchByOption, searchState.searchForOption);
    return <ISearchChoices>{searchByChoices, searchForChoices};
  }

  /**
   * Creates ChoiceConfigs from the search options
   * @param options An array of options to map to ChoiceConfigs
   * @returns {ChoiceConfig[]}
   * @private
   */
  private _createSearchOptionsChoices(options: Array<any>): ChoiceConfig[] {
    return options.map(option => new ChoiceConfig({value: option, label: option, state: new StateConfig({})}));
  }

  /**
   * Helper method to disable search by choices given a boolean
   * @param {boolean} isDisabled
   * @private
   */
  private _disableSearchByChoices(isDisabled: boolean): void {
    this._searchByChoices.forEach(choice => choice.state.isDisabled = isDisabled);
  }

  /**
   * Helper method to disable search by choices given a boolean
   * @param {boolean} isDisabled
   * @private
   */
  private _disableSearchForChoices(isDisabled: boolean): void {
    this._searchForChoices.forEach(choice => choice.state.isDisabled = isDisabled);
  }

  /**
   * Gets the search by choices
   * @param {NavContextType} navContext
   * @param {SearchByOptions} searchByOption
   * @returns {ChoiceConfig[]}
   * @private
   */
  private _getSearchByChoices(navContext: NavContextType): ChoiceConfig[] {
    if (navContext === NavContextType.DEFAULT) {
      this._disableSearchByChoices(false);
      this._searchByChoices[1].state.isDisabled = true;
    } else if (navContext === NavContextType.CUSTOMER) {
      this._disableSearchByChoices(false);
    }
    return this._searchByChoices;
  }

  /**
   * Gets the search for choices based on the current search by and search for option
   * @param {SearchByOptions} searchByOption
   * @param {SearchForOptions} searchForOption
   * @returns {ChoiceConfig[]}
   * @private
   */
  private _getSearchForChoices(searchByOption: SearchByOptions, searchForOption: SearchForOptions): ChoiceConfig[] {
    const shouldDisable = searchForOption === null || searchByOption !== SearchByOptions.THIS_CUSTOMER;
    this._disableSearchForChoices(shouldDisable);
    return this._searchForChoices;
  }
}
