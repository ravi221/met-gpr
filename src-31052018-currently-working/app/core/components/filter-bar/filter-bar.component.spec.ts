import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {Component, ViewChild} from '@angular/core';
import {FilterBarComponent} from './filter-bar.component';
import {FilterChipsStubComponent} from '../filter-chips/filter-chips.component.stub';
import {FilterLinksStubComponent} from '../filter-links/filter-links.component.stub';
import {FilterMenuStubComponent} from '../filter-menu/filter-menu.component.stub';
import {IFilterLink} from '../../interfaces/iFilterLink';
import {SortMenuStubComponent} from '../sort-menu/sort-menu.component.stub';

describe('FilterBarComponent', () => {
  let component: TestFilterBarComponent;
  let fixture: ComponentFixture<TestFilterBarComponent>;
  let subLink: IFilterLink;
  let filterLink: IFilterLink;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        TestFilterBarComponent,
        FilterBarComponent,
        SortMenuStubComponent,
        FilterMenuStubComponent,
        FilterLinksStubComponent,
        FilterChipsStubComponent
      ]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(TestFilterBarComponent);
        component = fixture.componentInstance;
        subLink = {
          filter: {
            prop1: 'test'
          },
          label: 'Label',
          subLinks: [],
          active: true
        };

        filterLink = {
          filter: {
            prop1: 'test'
          },
          label: 'Label',
          subLinks: [subLink],
          active: true
        };
        component.filterLinks = [filterLink];
        fixture.detectChanges();
      });
  }));

  afterEach(() => {
    if (fixture) {
      fixture.destroy();
    }
  });

  describe('Filter Links', () => {
    it('should emit an event when the filter link changes', () => {
      const spy = spyOn(component, 'handleFilterLinkChange').and.stub();
      component.filterBar.updateActiveLink(filterLink);
      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledWith(filterLink.filter);
    });

    it('should emit an event when the sub filter link changes', () => {
      const spy = spyOn(component, 'handleFilterLinkChange').and.stub();
      component.filterBar.updateActiveSubLink(subLink);
      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledWith(subLink.filter);
    });

    it('should reset sub links when the active link changes', () => {
      expect(subLink.active).toBeTruthy();

      component.filterBar.updateActiveLink(filterLink);
      expect(subLink.active).toBeFalsy();
    });
  });

  describe('Filter Menu', () => {
    it('should emit an event when the filter menu changes', () => {
      const spy = spyOn(component, 'handleFilterMenuChange').and.stub();
      component.filterBar.handleFilterMenuChange(filterLink.filter);
      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledWith(filterLink.filter);
    });
  });

  describe('Sort Menu', () => {
    it('should emit an event when the sort changes', () => {
      const spy = spyOn(component, 'handleSortChange').and.stub();
      component.filterBar.applySort(null);
      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledWith(null);
    });
  });

  describe('Filter Chips', () => {
    it('should create new filter chips when the filter menu changes', () => {
      expect(component.filterBar.filterChips.length).toBe(0);

      component.filterBar.handleFilterMenuChange(filterLink.filter);
      expect(component.filterBar.filterChips.length).toBe(1);
    });

    it('should remove a filter chip when calling remove', () => {
      component.filterBar.handleFilterMenuChange(filterLink.filter);
      expect(component.filterBar.filterChips.length).toBe(1);

      component.filterBar.handleFilterChipRemove({property: 'prop1', value: 'test'});
      component.filterBar.handleFilterMenuChange(filterLink.filter);
      expect(component.filterBar.filterChips.length).toBe(0);
    });

    it('should reset sub links when the active link changes', () => {
      expect(subLink.active).toBeTruthy();

      component.filterBar.updateActiveLink(filterLink);
      expect(subLink.active).toBeFalsy();
    });
  });

  @Component({
    selector: 'gpr-test-filter-bar',
    template: `
      <gpr-filter-bar [showSortMenu]="true"
                      [showFilterLinks]="true"
                      [showFilterMenu]="true"
                      [filterLinks]="filterLinks"
                      [filterMenuProperties]="['prop1']"
                      (filterLinkChange)="handleFilterLinkChange($event)"
                      (filterMenuChange)="handleFilterMenuChange($event)"
                      (sortChange)="handleSortChange($event)"></gpr-filter-bar>
    `
  })
  class TestFilterBarComponent {
    @ViewChild(FilterBarComponent) filterBar: FilterBarComponent;
    public filterLinks: IFilterLink[] = [];

    public handleFilterLinkChange(e) {

    }

    public handleFilterMenuChange(e) {

    }

    public handleSortChange(e) {

    }
  }
});
