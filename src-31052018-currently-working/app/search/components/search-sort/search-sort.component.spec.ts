import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {SearchSortComponent} from './search-sort.component';
import {SearchSortService} from '../../services/search-sort.service';
import {Component, ViewChild} from '@angular/core';
import {SortMenuComponent} from '../../../core/components/sort-menu/sort-menu.component';
import {TooltipContentComponent} from '../../../ui-controls/components/tooltip/tooltip-content.component';
import {TooltipDirective} from '../../../ui-controls/components/tooltip/tooltip.directive';
import {TooltipService} from '../../../ui-controls/services/tooltip.service';
import {TooltipPositionService} from '../../../ui-controls/services/tooltip-position.service';
import {mockSearchState} from '../../../../assets/test/common-objects/search-state.mock';
import {NavContextType} from '../../../navigation/enums/nav-context';
import {ISearchState} from '../../interfaces/iSearchState';

describe('SearchSortComponent', () => {
  let component: TestSearchSortComponent;
  let fixture: ComponentFixture<TestSearchSortComponent>;

  function updateSearchState(newSearchState: ISearchState) {
    component.searchState = null;
    fixture.detectChanges();
    component.searchState = newSearchState;
    fixture.detectChanges();
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        SearchSortComponent,
        TestSearchSortComponent,
        SortMenuComponent,
        TooltipContentComponent,
        TooltipDirective
      ],
      providers: [
        SearchSortService,
        TooltipService,
        TooltipPositionService
      ]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(TestSearchSortComponent);
        component = fixture.componentInstance;
        component.searchState = mockSearchState;
        fixture.detectChanges();
      });
  }));

  afterEach(() => {
    if (fixture) {
      fixture.destroy();
    }
  });

  it('running ngOnInit should update sort', () => {
    const spy = spyOn(component, 'testSort').and.stub();

    const newSearchState = mockSearchState;
    newSearchState.showSearchResults = true;
    newSearchState.navContext = NavContextType.SEARCH;
    newSearchState.searchResults = {results: [{}], page: 1, pageSize: 10, totalCount: 1};
    updateSearchState(newSearchState);
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledTimes(1);

    component.sort.ngOnInit();

    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledTimes(2);
  });

  it('should not show the sort when the search state is null', () => {
    updateSearchState(null);

    expect(component.sort.showSort).toBeFalsy();
    expect(component.sort.sortOptions.length).toBe(0);
  });

  it('should not show the sort when the search state is undefined', () => {
    updateSearchState(undefined);

    expect(component.sort.showSort).toBeFalsy();
    expect(component.sort.sortOptions.length).toBe(0);
  });

  it('should not show the sort when showSearchResults is false', () => {
    const newSearchState = mockSearchState;
    mockSearchState.showSearchResults = false;
    mockSearchState.navContext = NavContextType.SEARCH;
    updateSearchState(newSearchState);

    expect(component.sort.showSort).toBeFalsy();
  });

  it('should not show the sort when the nav context is not \'SEARCH\'', () => {
    const newSearchState = mockSearchState;
    newSearchState.showSearchResults = true;
    newSearchState.navContext = NavContextType.CUSTOMER;
    updateSearchState(newSearchState);

    expect(component.sort.showSort).toBeFalsy();
  });

  it('should emit an event when the sort changes', () => {
    const spy = spyOn(component, 'testSort').and.stub();

    const newSearchState = mockSearchState;
    newSearchState.showSearchResults = true;
    newSearchState.navContext = NavContextType.SEARCH;
    newSearchState.searchResults = {results: [{}], page: 1, pageSize: 10, totalCount: 1};
    updateSearchState(newSearchState);

    expect(component.sort.showSort).toBeTruthy();
    expect(spy).toHaveBeenCalled();
  });

  it('should not emit an event when the search type is null', () => {
    const spy = spyOn(component, 'testSort').and.stub();

    const newSearchState = mockSearchState;
    newSearchState.searchType = null;
    newSearchState.showSearchResults = true;
    newSearchState.navContext = NavContextType.SEARCH;
    newSearchState.searchResults = {results: [{}], page: 1, pageSize: 10, totalCount: 1};
    updateSearchState(newSearchState);

    expect(spy).not.toHaveBeenCalled();
  });

  @Component({
    template: `
      <gpr-search-sort [searchState]="searchState" (sortChange)="testSort($event)"></gpr-search-sort>`
  })
  class TestSearchSortComponent {
    @ViewChild(SearchSortComponent) sort;
    public searchState: ISearchState;

    public testSort(sortOption) {
    }
  }
});
