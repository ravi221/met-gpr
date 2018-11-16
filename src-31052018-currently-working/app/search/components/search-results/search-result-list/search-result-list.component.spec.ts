import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {Component, ViewChild} from '@angular/core';
import {CustomerListStubComponent} from '../../../../customer/components/customer-list/customer-list.component.stub';
import {IconComponent} from '../../../../ui-controls/components/icon/icon.component';
import {LoadingIconComponent} from '../../../../ui-controls/components/loading-icon/loading-icon.component';
import {mockSearchState} from '../../../../../assets/test/common-objects/search-state.mock';
import {SearchAttributeDetailsListStubComponent} from '../attribute-details-list/attribute-details-list.component.stub';
import {SearchAttributeListStubComponent} from '../attribute-list/attribute-list.component.stub';
import {SearchCustomerListStubComponent} from '../customer-list/customer-list.component.stub';
import {SearchPlanListStubComponent} from '../plan-list/plan-list.component.stub';
import {SearchResultListComponent} from './search-result-list.component';
import {SearchResultListService} from '../../../services/search-result-list.service';

describe('SearchResultListComponent', () => {
  let component: TestSearchResultListComponent;
  let fixture: ComponentFixture<TestSearchResultListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        TestSearchResultListComponent,
        SearchResultListComponent,
        SearchAttributeListStubComponent,
        SearchAttributeDetailsListStubComponent,
        SearchPlanListStubComponent,
        SearchCustomerListStubComponent,
        CustomerListStubComponent,
        LoadingIconComponent,
        IconComponent
      ],
      providers: [
        SearchResultListService
      ]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(TestSearchResultListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
      });
  }));

  afterEach(() => {
    if (fixture) {
      fixture.destroy();
    }
  });

  describe('Event Emitters' , () => {
    it('should emit customer click event', () => {
      const customerNumber = 1;
      const spy = spyOn(component, 'onCustomer').and.stub();
      component.searchResultList.onCustomerClick(customerNumber);
      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledWith(customerNumber);
    });

    it('should emit plan click event', () => {
      const planId = '1';
      const spy = spyOn(component, 'onPlan').and.stub();
      component.searchResultList.onPlanClick(planId);
      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledWith(planId);
    });

    it('should emit attribute details click event', () => {
      const attribute = {attributeTest: '1'};
      const spy = spyOn(component, 'onAttributeDetails').and.stub();
      component.searchResultList.onAttributeDetailsClick(attribute);
      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledWith(attribute);
    });

    it('should emit show more results click event', () => {
      const spy = spyOn(component, 'onShowMoreResults').and.stub();
      component.searchResultList.onShowMoreResultsClick();
      expect(spy).toHaveBeenCalled();
    });

    it('should not emit show more results scroll event when there are not more search results', () => {
      component.searchResultList.hasMoreResults = false;
      fixture.detectChanges();
      const spy = spyOn(component, 'onShowMoreResultsScroll').and.stub();
      component.searchResultList.onScrollAtBottom();
      expect(spy).not.toHaveBeenCalled();
    });

    it('should emit show more results scroll event when there are more search results', () => {
      component.searchResultList.hasMoreResults = true;
      fixture.detectChanges();
      const spy = spyOn(component, 'onShowMoreResultsScroll').and.stub();
      component.searchResultList.onScrollAtBottom();
      expect(spy).toHaveBeenCalled();
    });
  });

  @Component({
    template: `<gpr-search-result-list [searchState]="searchState"
                                       (attributeDetailsClick)="onAttributeDetails($event)"
                                       (customerClick)="onCustomer($event)"
                                       (planClick)="onPlan($event)"
                                       (showMoreResultsClick)="onShowMoreResults()"
                                       (showMoreResultsScroll)="onShowMoreResultsScroll()"></gpr-search-result-list>`
  })
  class TestSearchResultListComponent {
    @ViewChild(SearchResultListComponent) searchResultList;
    searchState = mockSearchState;
    onAttributeDetails(e) {

    }

    onCustomer(e) {

    }

    onPlan(e) {

    }

    onShowMoreResults() {

    }

    onShowMoreResultsScroll() {

    }
  }
});
