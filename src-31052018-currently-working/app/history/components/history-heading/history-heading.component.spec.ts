import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {HistoryHeadingComponent} from './history-heading.component';
import {By} from '@angular/platform-browser';
import {Component, ViewChild} from '@angular/core';
import {ToggleComponent} from '../../../ui-controls/components/toggle/toggle.component';
import {IconComponent} from '../../../ui-controls/components/icon/icon.component';
import {SelectMenuComponent} from '../../../ui-controls/components/select-menu/select-menu.component';
import {HistoryService} from '../../services/history.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {Observable} from 'rxjs/Observable';
import {MockHistoryService} from '../../services/history.service.mock';


describe('HistoryHeadingComponent', () => {
  let component: TestHistoryHeaderComponent;
  let fixture: ComponentFixture<TestHistoryHeaderComponent>;
  let historyService: HistoryService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      declarations: [
        HistoryHeadingComponent,
        IconComponent,
        SelectMenuComponent,
        TestHistoryHeaderComponent,
        ToggleComponent,
      ],
      providers: [
        {provide: HistoryService, useClass: MockHistoryService},
      ]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(TestHistoryHeaderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        historyService = TestBed.get(HistoryService);
      });
  }));

  afterEach(() => {
    if (fixture) {
      fixture.destroy();
    }
  });

  describe('History Heading', () => {
    it('should properly show customer name', () => {
      const customerName = fixture.debugElement.query(By.css('.customer-title'));
      expect(customerName.nativeElement.innerText).toBe('Test Customer');
    });
    it('should properly show customer number', () => {
      const customerNumber = fixture.debugElement.query(By.css('.customer-details span'));
      expect(customerNumber.nativeElement.innerText).toContain('1111111');
    });
    it('should properly show customer effective date', () => {
      const effectiveDate = fixture.debugElement.query(By.css('.customer-details'));
      expect(effectiveDate.nativeElement.innerText).toContain('01/01/1980');
    });
    it('should output event when clicking on toggle button', () => {
      const spy = spyOn(historyService, 'toggleAllComments').and.returnValue(Observable.of(false));
      fixture.detectChanges();
      component.historyHeadingContainer.toggleComments(false);
      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledWith(false);
    });
  });

  @Component({
    template: `
      <gpr-history-heading [customerName]="customer?.customerName"
                           [customerNumber]="customer?.customerNumber"
                           [effectiveDate]="customer?.effectiveDate"
                           (commentsShow)="onCommentsShow($event)"></gpr-history-heading>
    `
  })
  class TestHistoryHeaderComponent {
    @ViewChild(HistoryHeadingComponent) historyHeadingContainer;
    public customer = {
      customerName: 'Test Customer',
      customerNumber: '1111111',
      effectiveDate: '01/01/1980'
    };

    public onCommentsShow(e) {
    }
  }
});
