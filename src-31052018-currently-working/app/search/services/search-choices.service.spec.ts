import {SearchChoicesService} from './search-choices.service';
import {SearchByOptions} from '../enums/SearchByOptions';
import {NavContextType} from '../../navigation/enums/nav-context';
import {SearchForOptions} from '../enums/SearchForOptions';
import {ISearchState} from '../interfaces/iSearchState';
import {mockSearchState} from '../../../assets/test/common-objects/search-state.mock';

describe('SearchChoicesService', () => {
  let service: SearchChoicesService;
  let searchState: ISearchState;

  beforeEach(() => {
    searchState = mockSearchState;
    service = new SearchChoicesService();
  });

  describe('Base options', () => {
    it('should create three search by options', () => {
      const searchChoices = service.getSearchChoicesBySearchState(searchState);

      expect(searchChoices.searchByChoices.length).toBe(3);
      expect(searchChoices.searchByChoices[0].value).toBe('All Customers');
      expect(searchChoices.searchByChoices[1].value).toBe('This Customer');
      expect(searchChoices.searchByChoices[2].value).toBe('By User');
    });

    it('should create two search for options', () => {
      const searchChoices = service.getSearchChoicesBySearchState(searchState);

      expect(searchChoices.searchForChoices.length).toBe(2);
      expect(searchChoices.searchForChoices[0].value).toBe('Plan');
      expect(searchChoices.searchForChoices[1].value).toBe('Attribute');
    });
  });

  describe('SearchByOption: All Customers', () => {
    it('should disable all search for choices', () => {
      searchState.searchByOption = SearchByOptions.ALL_CUSTOMERS;
      searchState.searchForOption = null;
      const searchChoices = service.getSearchChoicesBySearchState(searchState);

      searchChoices.searchForChoices.forEach(choice => {
        expect(choice.state.isDisabled).toBeTruthy();
      });
    });

    it('should disable \'This Customer\' when nav context is default', () => {
      searchState.searchByOption = SearchByOptions.ALL_CUSTOMERS;
      searchState.searchForOption = null;
      searchState.navContext = NavContextType.DEFAULT;
      const searchChoices = service.getSearchChoicesBySearchState(searchState);
      expect(searchChoices.searchForChoices[1].state.isDisabled).toBeTruthy();
    });

    it('should initially disable this customer option when nav context is search', () => {
      searchState.searchByOption = SearchByOptions.ALL_CUSTOMERS;
      searchState.searchForOption = null;
      searchState.navContext = NavContextType.SEARCH;
      const searchChoices = service.getSearchChoicesBySearchState(searchState);
      expect(searchChoices.searchByChoices[1].state.isDisabled).toBeTruthy();
    });

    it('should not disable this customer option when nav context is changed to search', () => {
      searchState.searchByOption = SearchByOptions.THIS_CUSTOMER;
      searchState.searchForOption = SearchForOptions.PLAN;
      searchState.navContext = NavContextType.CUSTOMER;

      service.getSearchChoicesBySearchState(searchState);
      searchState.searchByOption = SearchByOptions.ALL_CUSTOMERS;
      searchState.searchForOption = null;
      searchState.navContext = NavContextType.SEARCH;

      const searchChoices = service.getSearchChoicesBySearchState(searchState);
      expect(searchChoices.searchByChoices[1].state.isDisabled).toBeFalsy();
    });
  });

  describe('SearchByOption: This Customer', () => {
    it('should enable search for choices', () => {
      searchState.searchByOption = SearchByOptions.THIS_CUSTOMER;
      searchState.searchForOption = SearchForOptions.PLAN;
      const searchChoices = service.getSearchChoicesBySearchState(searchState);

      searchChoices.searchForChoices.forEach(choice => {
        expect(choice.state.isDisabled).toBeFalsy();
      });
    });
  });

  describe('SearchByOption: By User', () => {
    it('should disable search for choices', () => {
      searchState.searchByOption = SearchByOptions.BY_USER;
      searchState.searchForOption = null;
      const searchChoices = service.getSearchChoicesBySearchState(searchState);

      searchChoices.searchForChoices.forEach(choice => {
        expect(choice.state.isDisabled).toBeTruthy();
      });
    });

    it('should disable this customer option when nav context is search', () => {
      searchState.searchByOption = SearchByOptions.BY_USER;
      searchState.searchForOption = null;
      searchState.navContext = NavContextType.SEARCH;
      const searchChoices = service.getSearchChoicesBySearchState(searchState);
      expect(searchChoices.searchByChoices[1].state.isDisabled).toBeTruthy();
    });
  });
});
