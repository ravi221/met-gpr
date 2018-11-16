import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {Component, DebugElement, OnInit, ViewChild} from '@angular/core';

import {AutoSearchComponent} from './auto-search.component';
import {Observable} from 'rxjs/Observable';
import {By} from '@angular/platform-browser';
import {ICustomer} from 'app/customer/interfaces/iCustomer';
import {IAutoSearchResultItem} from 'app/ui-controls/interfaces/iAutoSearchResultItem';
import {FormsModule} from '@angular/forms';


describe('AutoSearchComponent', () => {
  let component: TestAutoSearchComponent;
  let fixture: ComponentFixture<TestAutoSearchComponent>;
  let results: DebugElement;
  let mockCustomer = <ICustomer>{
    customerName: 'MockCustomer',
    customerNumber: 1234,
    effectiveDate: '1/1/2018'
  };
  let mockCustomerAutoSearchItem = <IAutoSearchResultItem>{
    model: mockCustomer,
    title: mockCustomer.customerName + ' #' + mockCustomer.customerNumber
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [TestAutoSearchComponent, AutoSearchComponent]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(TestAutoSearchComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        results = fixture.debugElement.query(By.css('.auto-complete-results'));
      });
  }));

  afterEach(() => {
    if (fixture) {
      fixture.destroy();
    }
  });

  it('should display placeholder text', () => {
    const textBox = fixture.debugElement.query(By.css('input')).nativeElement;
    expect(textBox.placeholder).toBe(component.placeholderText);
  });

  it('should call onItemSelected when item selected', () => {
    const spy = spyOn(component, 'itemSelected').and.stub();
    component.autoSearchComponent.select(mockCustomerAutoSearchItem);
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith(mockCustomerAutoSearchItem.model);
  });

  describe('Searching', () => {
    it('should search after 2 characters entered', (done) => {
      component.autoSearchComponent.searchResultsObservable.subscribe(data => {
        expect(data.length).toBe(1);
        done();
      });
      component.autoSearchComponent.query = 'ab';
      component.autoSearchComponent.search(<KeyboardEvent>{code: 'e'});
    });
  });

  @Component({
    template: `
      <gpr-auto-search [getRemoteData]="serviceCall"
                       (onItemSelected)="itemSelected($event)"
                       [placeholderText]="placeholderText"
                       [formatDataFunction]="formatDataFunction">
      </gpr-auto-search>
    `
  })
  class TestAutoSearchComponent implements OnInit {

    @ViewChild(AutoSearchComponent) autoSearchComponent;

    public placeholderText: string = 'Type a customer name or number';
    public selectedItem: any;
    public serviceCall: any;

    public formatDataFunction(data: any): Array<IAutoSearchResultItem> {
      return data.map(element => {
        return <IAutoSearchResultItem>{title: element.customerName + ' #' + element.customerNumber, model: element};
      });
    }

    ngOnInit(): void {
      this.serviceCall = () => {
        return Observable.of([mockCustomer]);
      };
    }

    public itemSelected(e) {
      this.selectedItem = e;
    }
  }

});
