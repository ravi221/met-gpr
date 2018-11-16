import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {SearchCustomerListComponent} from './customer-list.component';
import {Component, DebugElement, ViewChild} from '@angular/core';
import {ICustomer} from '../../../../customer/interfaces/iCustomer';
import {By} from '@angular/platform-browser';
import {SearchCustomerListItemComponent} from '../customer-list-item/customer-list-item.component';
import {SearchResultTitleComponent} from '../search-result-title/search-result-title.component';
import {SearchResultComponent} from '../search-result/search-result.component';
import {IconComponent} from '../../../../ui-controls/components/icon/icon.component';
import {SearchResultTitleService} from '../../../services/search-result-title.service';
import {click} from '../../../../../assets/test/TestHelper';

describe('SearchCustomerListComponent', () => {
  let component: TestSearchCustomerListComponent;
  let fixture: ComponentFixture<TestSearchCustomerListComponent>;
  let searchResult: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        TestSearchCustomerListComponent,
        SearchCustomerListComponent,
        SearchCustomerListItemComponent,
        SearchResultComponent,
        SearchResultTitleComponent,
        IconComponent
      ],
      providers: [
        SearchResultTitleService
      ]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(TestSearchCustomerListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        searchResult = fixture.debugElement.query(By.css('.search-result:first-child'));
      });
  }));

  afterEach(() => {
    if (fixture) {
      fixture.destroy();
    }
  });

  it('should create 3 customer search results', () => {
    const customers = fixture.debugElement.query(By.css('.search-customer-list'));
    expect(customers.children).toBeTruthy();
    expect(customers.children.length).toBe(3);
  });

  it('should should emit a customer when clicked', () => {
    const spy = spyOn(component, 'onCustomer').and.stub();
    click(searchResult);
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith(component.customers[0].customerNumber);
  });

  @Component({
    template: `
      <gpr-search-customer-list [customers]="customers"
                                (customerClick)="onCustomer($event)"></gpr-search-customer-list>
    `
  })
  class TestSearchCustomerListComponent {
    @ViewChild(SearchCustomerListComponent) customerList;

    customers = [
      <ICustomer>{customerName: 'Spacely Space Sprockets', effectiveDate: '06/01/2017', percentageCompleted: 10},
      <ICustomer>{customerName: 'Wonka Industries', effectiveDate: '06/01/2017', percentageCompleted: 60},
      <ICustomer>{customerName: 'Nakatomi Trading Corp.', effectiveDate: '07/01/2017', percentageCompleted: 30}
    ];

    onCustomer(e) {

    }
  }
});
