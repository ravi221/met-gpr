import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {PlanCopyComponent} from './plan-copy.component';
import {CustomerDataService} from '../../../customer/services/customer-data.service';
import {ActiveModalRef} from '../../../ui-controls/classes/modal-references';
import {PlanModule} from 'app/plan/plan.module';
import {IPlan} from 'app/plan/plan-shared/interfaces/iPlan';
import {ICustomer} from 'app/customer/interfaces/iCustomer';
import {TooltipService} from 'app/ui-controls/services/tooltip.service';
import {TooltipPositionService} from 'app/ui-controls/services/tooltip-position.service';
import {AuthorizationService} from 'app/core/services/authorization.service';
import {NotificationService} from '../../../core/services/notification.service';
import {CustomerSearchService} from '../../../search/services/customer-search.service';
import {DateService} from '../../../core/services/date.service';
import { PlanInputValidationService } from 'app/plan/services/plan-input-validation.service';

describe('PlanCopyComponent', () => {
  let component: PlanCopyComponent;
  let fixture: ComponentFixture<PlanCopyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        PlanModule
      ],
      providers: [
        CustomerDataService,
        ActiveModalRef,
        TooltipService,
        TooltipPositionService,
        AuthorizationService,
        NotificationService,
        CustomerSearchService,
        DateService,
        PlanInputValidationService
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanCopyComponent);
    component = fixture.componentInstance;
    component.planToCopy = <IPlan>{planName: 'Plan 1', planId: '1'};
    component.customerToCopyTo = <ICustomer>{effectiveDate: '1/1/2018', customerName: 'Customer X'};
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
