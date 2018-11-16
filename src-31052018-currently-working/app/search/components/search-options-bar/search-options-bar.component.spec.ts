import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {SearchOptionsBarComponent} from './search-options-bar.component';
import {SearchByOptions} from '../../enums/SearchByOptions';
import {SearchForOptions} from '../../enums/SearchForOptions';
import {SearchChoicesService} from '../../services/search-choices.service';
import {Component, ViewChild} from '@angular/core';
import {TabsComponent} from '../../../forms-controls/components/tabs/tabs.component';

describe('SearchOptionsBarComponent', () => {
  let component: TestSearchOptionsBarComponent;
  let fixture: ComponentFixture<TestSearchOptionsBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TestSearchOptionsBarComponent, SearchOptionsBarComponent, TabsComponent],
      providers: [SearchChoicesService]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(TestSearchOptionsBarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
      });
  }));

  afterEach(() => {
    if (fixture) {
      fixture.destroy();
    }
  });

  describe('Search for label', () => {
    it('should disable the \'Search For\' label for \'All Customers\' search', () => {
      component.searchState = {
        searchByOption: SearchByOptions.ALL_CUSTOMERS,
        searchForOption: null
      };
      fixture.detectChanges();
      expect(component.searchOptionsBar.isSearchForDisabled).toBeTruthy();
    });

    it('should disable the \'Search For\' label for \'By User\' search', () => {
      component.searchState = {
        searchByOption: SearchByOptions.BY_USER,
        searchForOption: null
      };
      fixture.detectChanges();
      expect(component.searchOptionsBar.isSearchForDisabled).toBeTruthy();
    });

    it('should enable the \'Search For\' label for \'This Customer\' and \'Plan\'', () => {
      component.searchState = {
        searchByOption: SearchByOptions.THIS_CUSTOMER,
        searchForOption: SearchForOptions.PLAN
      };
      fixture.detectChanges();
      expect(component.searchOptionsBar.isSearchForDisabled).toBeFalsy();
    });

    it('should enable the \'Search For\' label for \'This Customer\' and \'Attribute\'', () => {
      component.searchState = {
        searchByOption: SearchByOptions.THIS_CUSTOMER,
        searchForOption: SearchForOptions.ATTRIBUTE
      };
      fixture.detectChanges();
      expect(component.searchOptionsBar.isSearchForDisabled).toBeFalsy();
    });
  });

  describe('Search options change events', () => {
    it('should emit event when changing search by option', () => {
      const newSearchByOption = SearchByOptions.THIS_CUSTOMER;
      const spy = spyOn(component, 'onSearchBy').and.stub();
      component.searchOptionsBar.onSearchByChanged(newSearchByOption);
      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledWith(newSearchByOption);
    });

    it('should emit event when changing search for option', () => {
      const newSearchForOption = SearchForOptions.ATTRIBUTE;
      const spy = spyOn(component, 'onSearchFor').and.stub();
      component.searchOptionsBar.onSearchForChanged(newSearchForOption);
      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledWith(newSearchForOption);
    });
  });

  @Component({
    template: `
      <gpr-search-options-bar [searchState]="searchState"
                              (searchByOptionChange)="onSearchBy($event)"
                              (searchForOptionChange)="onSearchFor($event)"></gpr-search-options-bar>`
  })
  class TestSearchOptionsBarComponent {
    @ViewChild(SearchOptionsBarComponent) searchOptionsBar;
    searchState = null;

    onSearchBy(e) {

    }

    onSearchFor(e) {

    }
  }
});
