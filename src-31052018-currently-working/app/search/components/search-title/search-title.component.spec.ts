import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {SearchTitleComponent} from './search-title.component';
import {SearchTypes} from '../../enums/SearchTypes';
import {ISearchState} from '../../interfaces/iSearchState';
import {SearchByOptions} from '../../enums/SearchByOptions';
import {SearchForOptions} from '../../enums/SearchForOptions';
import {SearchTitleService} from '../../services/search-title.service';
import {mockSearchState} from '../../../../assets/test/common-objects/search-state.mock';

describe('SearchTitleComponent', () => {
  let component: SearchTitleComponent;
  let fixture: ComponentFixture<SearchTitleComponent>;
  let searchState: ISearchState;

  function updateSearchState(newSearchState: ISearchState): void {
    component.searchState = newSearchState;
    fixture.detectChanges();
    component.ngOnChanges();
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SearchTitleComponent],
      providers: [SearchTitleService]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(SearchTitleComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

        searchState = mockSearchState;
      });
  }));

  afterEach(() => {
    if (fixture) {
      fixture.destroy();
    }
  });

  describe('Changing search by options', () => {
    it('should change the search title when the \'All Customers\' button is selected', () => {
      searchState.showSearchResults = false;
      const originalSearchTitle = component.searchTitle;
      updateSearchState(searchState);
      expect(component.searchTitle).not.toBe(originalSearchTitle);
    });

    it('should not change change the search title when the \'All Customers\' button is selected twice', () => {
      searchState.showSearchResults = false;
      updateSearchState(searchState);

      const newSearchTitle = component.searchTitle;
      updateSearchState(searchState);
      expect(component.searchTitle).toBe(newSearchTitle);
    });

    it('should change the search title when the \'By User\' button is selected', () => {
      searchState.searchType = SearchTypes.BY_USER;
      searchState.searchByOption = SearchByOptions.BY_USER;

      const originalSearchTitle = component.searchTitle;
      updateSearchState(searchState);
      expect(component.searchTitle).not.toBe(originalSearchTitle);
    });

    it('should change the search title when the \'This Customer\' button is selected', () => {
      searchState.searchType = SearchTypes.PLAN;
      searchState.searchByOption = SearchByOptions.THIS_CUSTOMER;
      searchState.searchForOption = SearchForOptions.ATTRIBUTE;

      const originalSearchTitle = component.searchTitle;
      updateSearchState(searchState);
      expect(component.searchTitle).not.toBe(originalSearchTitle);
    });
  });
});
