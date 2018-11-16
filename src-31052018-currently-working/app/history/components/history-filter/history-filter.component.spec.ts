import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {click} from '../../../../assets/test/TestHelper';
import {Component, ViewChild} from '@angular/core';
import {CustomerDataService} from '../../../customer/services/customer-data.service';
import {DatePickerComponent} from '../../../ui-controls/components/date-picker/date-picker.component';
import {DatePickerDefaults} from '../../../ui-controls/services/date-picker-defaults.service';
import {FilterService} from '../../../core/services/filter.service';
import {FormsModule} from '@angular/forms';
import {HistoryFilterComponent} from './history-filter.component';
import {HistoryFilterService} from '../../services/history-filter.service';
import {ICustomer} from '../../../customer/interfaces/iCustomer';
import {OutsideClickDirective} from '../../../ui-controls/directives/outside-click.directive';
import {DatePipe} from '@angular/common';
import {DropDownComponent} from '../../../forms-controls/components/drop-down/drop-down.component';
import {IDatePickerOutput} from '../../../ui-controls/interfaces/iDatePickerOutput';

describe('HistoryFilterComponent', () => {
  let component: TestHistoryFilterComponent;
  let historyFilter: HistoryFilterComponent;
  let fixture: ComponentFixture<TestHistoryFilterComponent>;
  let filterService: HistoryFilterService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [
        DatePickerComponent,
        DropDownComponent,
        OutsideClickDirective,
        HistoryFilterComponent,
        TestHistoryFilterComponent
      ],
      providers: [
        CustomerDataService,
        DatePickerDefaults,
        FilterService,
        HistoryFilterService,
        {provide: CustomerDataService, useClass: MockCustomerDataService},
        DatePipe
      ]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(TestHistoryFilterComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

        historyFilter = component.historyFilter;
        filterService = TestBed.get(HistoryFilterService);
      });
  }));


  describe('Applying Filters', () => {
    it('should clear out the history filters when the \'Cancel\' button is clicked', () => {
      const spy = spyOn(filterService, 'setFilters').and.stub();

      const cancelBtn = fixture.debugElement.query(By.css('.btn.btn-tertiary'));
      click(cancelBtn, fixture);

      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledWith({
        keyword: '',
        userName: '',
        planName: '',
        planStatus: null,
        dateRangeFrom: null,
        dateRangeTo: null,
        versionFrom: null,
        versionTo: null,
        effectiveDate: null
      });
    });

    it('should apply the history filters when the \'Apply Filters\' button is clicked', () => {
      const spy = spyOn(filterService, 'setFilters').and.stub();
      const applyBtn = fixture.debugElement.query(By.css('.btn.btn-secondary'));
      click(applyBtn, fixture);

      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledWith({
        keyword: '',
        userName: '',
        planName: '',
        planStatus: null,
        dateRangeFrom: null,
        dateRangeTo: null,
        versionFrom: null,
        versionTo: null,
        effectiveDate: null
      });
    });
  });

  describe('Setting Dates', () => {
    it('should set the date range from', () => {
      const inputDate = <IDatePickerOutput>{dateString: '03-16-1979'};
      const expectedDate = '03-16-1979';
      historyFilter.setDateRangeFrom(inputDate);
      fixture.detectChanges();
      expect(historyFilter.filter.dateRangeFrom).toBe(expectedDate);
    });

    it('should set the date range to', () => {
      const inputDate = <IDatePickerOutput>{dateString: '03-16-1999'};
      const expectedDate = '03-16-1999';
      historyFilter.setDateRangeTo(inputDate);
      fixture.detectChanges();
      expect(historyFilter.filter.dateRangeTo).toBe(expectedDate);
    });

    it('should set the effective date', () => {
      const inputDate = <IDatePickerOutput>{dateString: '03-16-1989'};
      const expectedDate = '03-16-1989';
      historyFilter.setEffectiveDate(inputDate);
      fixture.detectChanges();
      expect(historyFilter.filter.effectiveDate).toBe(expectedDate);
    });
  });

  @Component({
    template: `
      <gpr-history-filter [customer]="customer"></gpr-history-filter>`
  })
  class TestHistoryFilterComponent {
    @ViewChild(HistoryFilterComponent) historyFilter;
    customer = <ICustomer>{customerNumber: 1};
  }

  class MockCustomerDataService {
  }
});
