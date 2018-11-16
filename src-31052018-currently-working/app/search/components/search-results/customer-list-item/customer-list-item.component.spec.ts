import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {click} from '../../../../../assets/test/TestHelper';
import {Component, DebugElement, ViewChild} from '@angular/core';
import {IconComponent} from '../../../../ui-controls/components/icon/icon.component';
import {ICustomer} from '../../../../customer/interfaces/iCustomer';
import {SearchCustomerListItemComponent} from './customer-list-item.component';
import {SearchResultComponent} from '../search-result/search-result.component';
import {SearchResultTitleComponent} from '../search-result-title/search-result-title.component';
import {SearchResultTitleService} from '../../../services/search-result-title.service';

describe('SearchCustomerListItemComponent', () => {
  let component: TestSearchCustomerListItemComponent;
  let fixture: ComponentFixture<TestSearchCustomerListItemComponent>;
  let searchResult: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        IconComponent,
        SearchCustomerListItemComponent,
        SearchResultComponent,
        SearchResultTitleComponent,
        TestSearchCustomerListItemComponent,
      ],
      providers: [
        SearchResultTitleService
      ]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(TestSearchCustomerListItemComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        searchResult = fixture.debugElement.query(By.css('.search-result'));
      });
  }));

  afterEach(() => {
    if (fixture) {
      fixture.destroy();
    }
  });

  it('should setup the customer search result correctly', () => {
    const icon = searchResult.query(By.css('img'));
    const title = searchResult.query(By.css('.search-result-title span:first-child'));
    const subtitle = searchResult.query(By.css('.search-result-subtitle'));
    expect(icon.nativeElement.src).toContain('customer-icon');
    expect(title.nativeElement.innerHTML).toBe('Spacely Space Sprockets - 1');
    expect(subtitle.nativeElement.innerHTML).toBe('Effective: 06/01/2017, 10% Complete');
  });

  it('should trigger the customer click event when the customer is clicked', () => {
    const spy = spyOn(component, 'onCustomer').and.stub();
    click(searchResult, fixture);
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith(component.customer.customerNumber);
  });

  @Component({
    template: `
      <gpr-search-customer-list-item [customer]="customer"
                                     (customerClick)="onCustomer($event)"></gpr-search-customer-list-item>
    `
  })
  class TestSearchCustomerListItemComponent {
    @ViewChild(SearchCustomerListItemComponent) customerListItem;

    public customer = <ICustomer>{
      customerName: 'Spacely Space Sprockets',
      effectiveDate: '06/01/2017',
      percentageCompleted: 10,
      customerNumber: 1
    };

    public onCustomer(e) {

    }
  }
});
