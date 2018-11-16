import {ActiveModalRef} from '../../../ui-controls/classes/modal-references';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {ICreatePlanResponse} from '../../interfaces/iCreatePlanResponse';
import {NotificationService} from '../../../core/services/notification.service';
import {Observable} from 'rxjs/Observable';
import {PlanCreateComponent} from './plan-create.component';
import {PlanDataService} from 'app/plan/plan-shared/services/plan-data.service';
import {PlanInputGridStubComponent} from '../plan-input-grid/plan-input-grid.component.stub';
import {mockCustomer} from '../../../../assets/test/common-objects/customer.mock';
import {IPlanInputTemplate} from '../../interfaces/iPlanInputTemplate';
import {NotificationTypes} from '../../../core/models/notification-types';

describe('PlanCreateComponent', () => {
  let component: PlanCreateComponent;
  let fixture: ComponentFixture<PlanCreateComponent>;
  let planDataService: PlanDataService;
  let notificationService: NotificationService;

  const customer = mockCustomer;
  const planTemplate: IPlanInputTemplate = {
    planNamePrefix: 'Test - ',
    planNameBody: 'Plan Name',
    coverageId: '1',
    coverageName: 'Coverage Name 1',
    effectiveDate: '01/01/2000',
    customerNumber: 1,
    ppcModelName: 'modelName',
    hasErrors: false,
    errors: [],
    isComplete: false
  };

  class PlanDataServiceMock {
    createPlan(): Observable<ICreatePlanResponse> {
      return Observable.of({
        responseCode: 'SUCCESS',
        planId: '1',
        planName: 'Test Plan Name 1'
      });
    }
  }

  class ActiveModalRefMock {
    close() {

    }
  }

  class NotificationServiceMock {
    addNotification() {

    }
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        PlanCreateComponent,
        PlanInputGridStubComponent
      ],
      providers: [
        {provide: NotificationService, useClass: NotificationServiceMock},
        {provide: PlanDataService, useClass: PlanDataServiceMock},
        {provide: ActiveModalRef, useClass: ActiveModalRefMock},
      ]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(PlanCreateComponent);
        component = fixture.componentInstance;
        component.customer = customer;
        fixture.detectChanges();
        planDataService = TestBed.get(PlanDataService);
        notificationService = TestBed.get(NotificationService);
      });
  }));

  afterEach(() => {
    if (fixture) {
      fixture.destroy();
    }
  });

  describe('Creating new plans', () => {
    it('should submit two requests to create a plan', () => {
      const planTemplates = [planTemplate, planTemplate];
      const spy = spyOn(planDataService, 'createPlan').and.callThrough();
      component.createPlansFromTemplates(planTemplates);
      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledTimes(2);
    });

    it('should correctly create a plan request', () => {
      const planTemplates = [planTemplate];
      const spy = spyOn(planDataService, 'createPlan').and.callThrough();
      component.createPlansFromTemplates(planTemplates);
      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledWith({
        planName: 'Test - Plan Name',
        coverageId: '1',
        coverageName: 'Coverage Name 1',
        effectiveDate: '01/01/2000',
        customerNumber: 1,
        ppcModelName: 'modelName'
      });
    });
  });

  describe('Adding notifications', () => {
      it('should add a success notification once all plans have successfully created ', () => {
        const spy = spyOn(notificationService, 'addNotification').and.callThrough();
        const planTemplates = [planTemplate, planTemplate];
        component.createPlansFromTemplates(planTemplates);
        expect(spy).toHaveBeenCalled();
        expect(spy).toHaveBeenCalledWith(NotificationTypes.SUCCESS, 'Successfully created: Test Plan Name 1, Test Plan Name 1');
      });

    it('should add an error notification at least one plan has failed ', () => {
      const spy = spyOn(notificationService, 'addNotification').and.callThrough();
      spyOn(planDataService, 'createPlan').and.callFake(() => {
        return Observable.throw('error');
      });
      const planTemplates = [planTemplate, planTemplate];
      component.createPlansFromTemplates(planTemplates);
      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledWith(NotificationTypes.ERROR, 'Unsuccessfully created: Test - Plan Name, Test - Plan Name');
    });
  });
});
