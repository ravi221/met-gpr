import {async, ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import {FlagFilterComponent} from './flag-filter.component';
import {IconComponent} from '../../../ui-controls/components/icon/icon.component';
import {By} from '@angular/platform-browser';
import {Component, ViewChild, DebugElement} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ICustomer } from 'app/customer/interfaces/iCustomer';
import { FilterService } from 'app/core/services/filter.service';
import { CustomerDataService } from 'app/customer/services/customer-data.service';
import {HttpClient, HttpHandler} from '@angular/common/http';
import { PagingService } from '../../../ui-controls/services/paging.service';
import { ScrollService } from '../../../ui-controls/services/scroll.service';
import { UserProfileService } from '../../../core/services/user-profile.service';
import { LogoutComponent } from '../../../navigation/components/logout/logout.component';
import { LogoutService } from '../../../navigation/services/logout.service';
import { Idle, IdleExpiry } from '@ng-idle/core';
import { MockUserProfileService } from '../../../core/services/user-profile-service-mock';
import { Observable } from 'rxjs/Observable';
import { CustomerSearchService } from '../../../search/services/customer-search.service';
import { DateService } from 'app/core/services/date.service';
import { FlagFilterService } from '../../services/flag-filter.service';
import { IFlagFilter } from '../../interfaces/iFlagFilter';
import { IFlag } from 'app/flag/interfaces/iFlag';
import { IFlagsResponse } from 'app/flag/interfaces/iFlagsResponse';
import { IFlagsRequest } from 'app/flag/interfaces/iFlagsRequest';
import { IFlaggedPlan } from 'app/flag/interfaces/iFlaggedPlan';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { FlagService } from 'app/flag/services/flag.service';
import { MockCustomerDataService } from 'app/customer/services/customer-data.service.mock';

describe('FlagFilterComponent', () => {
  let component: TestFlagFilterComponent;
  let fixture: ComponentFixture<TestFlagFilterComponent>;
  let flagFilterService: FlagFilterService;
  let filter: IFlagFilter = {
    planName: '',
    status: false
  };
  let filter1: IFlagFilter = {
    planName: '',
    status: null
  };

  let mockFlagResponse = <IFlagsResponse>{
    totalFlagCount: 9,
    plans: [
      {
        planId: '1',
        planName: 'Test Plan Name',
        flags: [
          {
            questionName: 'test',
            questionValue: 'question value',
            text: 'comment',
            lastUpdatedBy: 'John Smith',
            lastUpdatedByEmail: 'js@metlife.com',
            lastUpdatedTimestamp: '02-12-2018 16:32:59.910',
            isResolved: false
          }
        ]
      }
    ]
  };

  let triggerClickEvent = (element: DebugElement) => {
    element.triggerEventHandler('click', null);
    fixture.detectChanges();
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, FormsModule],
      declarations: [
        FlagFilterComponent,
        TestFlagFilterComponent,
        IconComponent],
      providers: [
        CustomerDataService,
        {provide: CustomerDataService, useClass: MockCustomerDataService},
        FlagFilterService,
        FilterService,
        FlagService,
        {provide: FlagService, useClass: MockFlagService}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestFlagFilterComponent);
    component = fixture.componentInstance;
    component.customer = <ICustomer>{customerName: 'Test Customer', customerNumber: 1234567};
    fixture.detectChanges();
    flagFilterService = TestBed.get(FlagFilterService);
  });

  afterEach(() => {
    if (fixture) {
      fixture.destroy();
    }
  });

  describe('Applying Filters', () => {
    it('should clear out the flag filters when the \'Cancel\' button is clicked', () => {
      const spy = spyOn(flagFilterService, 'setFlagFilters').and.stub();

      let cancelBtn = fixture.debugElement.query(By.css('.btn.btn-tertiary'));
      triggerClickEvent(cancelBtn);
      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledWith(filter);
    });

    it('should apply the flag filters when the \'Apply Filters\' button is clicked', () => {
      const spy = spyOn(flagFilterService, 'setFlagFilters').and.stub();

      let applyBtn = fixture.debugElement.query(By.css('.btn.btn-secondary'));
      triggerClickEvent(applyBtn);

      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledWith(filter1);
    });
  });

  @Component({
    template: `
      <gpr-flag-filter [customer]="customer"></gpr-flag-filter>
    `
  })
  class TestFlagFilterComponent {
    @ViewChild(FlagFilterComponent) flagFilter;

    customer: ICustomer = <ICustomer>{customerNumber: 1};
  }

  class MockFlagService {
    getPlansWithFlags(flagRequest: IFlagsRequest): Observable<IFlagsResponse> {
      return Observable.of(mockFlagResponse);
    }
  }

});


