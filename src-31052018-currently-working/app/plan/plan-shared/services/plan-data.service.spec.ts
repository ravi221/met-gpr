import {TestBed} from '@angular/core/testing';

import {PlanDataService} from './plan-data.service';
import {NotificationService} from '../../../core/services/notification.service';
import {ProgressService} from '../../../ui-controls/services/progress.service';
import {LogService} from '../../../core/services/log.service';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {IPlanCopyResponse} from 'app/plan/interfaces/iPlanCopyResponse';
import {ICreatePlanResponse} from 'app/plan/interfaces/iCreatePlanResponse';
import {IPlan} from 'app/plan/plan-shared/interfaces/iPlan';
import {PlanErrors} from 'app/plan/enums/plan-errors';
import {HttpResponse} from '@angular/common/http';
import * as createPlanMockErrorResponse from '../../../../assets/test/plans/create/Create-Plan-Response-Error.mock.json';
import * as createPlanMockSuccessResponse from '../../../../assets/test/plans/create/Create-Plan-Response-Success.mock.json';
import {Subscription} from 'rxjs/Subscription';
import {IPlanRequest} from '../../../customer/interfaces/iPlanRequest';
import {IPlanResponse} from '../../interfaces/iPlanReponse';
import {PagingService} from 'app/ui-controls/services/paging.service';
import {ScrollService} from 'app/ui-controls/services/scroll.service';
import {HelpDataService} from '../../services/help-data.service';
import {ICreatePlanRequest} from '../../interfaces/iCreatePlanRequest';

describe('PlanDataService', () => {
  let httpMock: HttpTestingController;
  let planDataService: PlanDataService;
  let subscription: Subscription;

  let testPlan = <IPlan>{
    planId: '1234',
    planName: 'Plan1',
    effectiveDate: '12/1/2015'
  };
  let testCustomerNumber = 1234;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        PlanDataService,
        NotificationService,
        ProgressService,
        LogService,
        PagingService,
        ScrollService,
        HelpDataService
      ]
    });
    planDataService = TestBed.get(PlanDataService);
    httpMock = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    if (subscription) {
      subscription.unsubscribe();
      subscription = null;
    }
  });

  describe('Copy Plan', () => {

    describe('Invalid Params', () => {
      it('should throw error when no plan is passed into copyPlan method', (done) => {
        subscription = planDataService.copyPlan(null, 1234).subscribe(() => {
          done.fail('Should not successfully call copy plan');
        }, (error: IPlanCopyResponse) => {
          expect(error.responseMessage).toBe(PlanErrors.EMPTY_PLAN);
          done();
        });
      });

      it('should throw error when no plan name is passed into copyPlan method', (done) => {
        subscription = planDataService.copyPlan(<IPlan>{planId: '1123', effectiveDate: '12/12/2017'}, 1234).subscribe(() => {
          done.fail('Should not successfully call copy plan');
        }, (error: IPlanCopyResponse) => {
          expect(error.responseMessage).toBe(PlanErrors.EMPTY_PLAN_NAME);
          done();
        });
      });

      it('should throw error when no plan id is passed into copyPlan method', (done) => {
        subscription = planDataService.copyPlan(<IPlan>{planName: 'plan 1', effectiveDate: '12/12/2017'}, 1234).subscribe(() => {
          done.fail('Should not successfully call copy plan');
        }, (error: IPlanCopyResponse) => {
          expect(error.responseMessage).toBe(PlanErrors.EMPTY_PLAN_ID);
          done();
        });
      });

      it('should throw error when no customer id passed into copyPlan method', (done) => {
        const copyPlan = <IPlan>{planName: 'plan 1', planId: '1123', effectiveDate: '12/12/2017'};
        subscription = planDataService.copyPlan(copyPlan, null).subscribe(() => {
          done.fail('Should not successfully call copy plan');
        }, (error: IPlanCopyResponse) => {
          expect(error.responseMessage).toBe(PlanErrors.EMPTY_CUSTOMER_ID);
          done();
        });
      });
      it('should throw error when no effective date is passed into copyPlan method', (done) => {
        const copyPlan = <IPlan>{planName: 'plan 1', planId: '1123'};
        subscription = planDataService.copyPlan(copyPlan, 1234).subscribe(() => {
          done.fail('Should not successfully call copy plan');
        }, (error: IPlanCopyResponse) => {
          expect(error.responseMessage).toBe(PlanErrors.EMPTY_EFFECTIVE_DATE);
          done();
        });
      });
    });

    describe('Errors', () => {
      it('should return error if getCustomer request failed', (done) => {
        subscription = planDataService.copyPlan(testPlan, testCustomerNumber).subscribe(() => {
          done.fail('Should not successfully call copy plan');
        }, (error) => {
          expect(error).toContain('A monkey is throwing bananas at me!');
          done();
        });

        let url = `/plans/${testPlan.planId}/copy`;
        let req = httpMock.expectOne(url);
        let err = new ErrorEvent('ERROR_COPYING_PLAN', {
          error: new Error('AAAHHHH'),
          message: 'A monkey is throwing bananas at me!'
        });
        req.error(err, {status: 400, statusText: err.message});
        httpMock.verify();
      });

      it('should return statusText if response is not ok', (done) => {
        subscription = planDataService.copyPlan(testPlan, testCustomerNumber).subscribe((res: any) => {
          expect(res.error).toBe('Errors!');
          done();
        }, () => {
          done.fail('Should not call error function when getting a response');
        });
        let mockResponse = new HttpResponse({status: 400, statusText: 'Errors!'});
        const reqStub = httpMock.expectOne({method: 'POST'});
        reqStub.flush(mockResponse);
        httpMock.verify();
      });
    });


    describe('Success', () => {
      it('should return valid IPlanCopyResponse if response is ok', (done) => {
        const mockCopyResponse = <IPlanCopyResponse>{
          planId: 9999,
          planName: 'Plan Name 99',
          responseMessage: 'Success'
        };
        subscription = planDataService.copyPlan(testPlan, testCustomerNumber).subscribe((res: IPlanCopyResponse) => {
          expect(res.planId).toBe(mockCopyResponse.planId);
          expect(res.planName).toBe(mockCopyResponse.planName);
          expect(res.responseMessage).toBe(mockCopyResponse.responseMessage);
          done();
        }, () => {
          done();
        });
        const reqStub = httpMock.expectOne({method: 'POST'});
        reqStub.flush(mockCopyResponse);
        httpMock.verify();
      });
    });
  });

  describe('Create Plan', () => {

    describe('Errors', () => {
      it('should return statusText if response is not 201', (done) => {
        const createPlanRequest: ICreatePlanRequest = {
          customerNumber: 1,
          planName: 'Voluntary - unique name',
          coverageId: '1234',
          coverageName: 'Voluntary A & H',
          effectiveDate: '01/01/2000',
          ppcModelName: 'sample'
        };

        subscription = planDataService.createPlan(createPlanRequest).subscribe(() => {
          done.fail('Should not successfully create plan');
        }, () => {
          done();
        });
        const url = `/plans`;
        const method = 'POST';
        let req = httpMock.expectOne({url, method});
        req.flush(createPlanMockErrorResponse);
        httpMock.verify();
      });

      it('should call the error function when an error occurs', (done) => {
        const createPlanRequest: ICreatePlanRequest = {
          customerNumber: 1,
          planName: 'Voluntary - unique name',
          coverageId: '1234',
          coverageName: 'Voluntary A & H',
          effectiveDate: '01/01/2000',
          ppcModelName: 'sample'
        };

        subscription = planDataService.createPlan(createPlanRequest).subscribe(() => {
          done.fail('Should not successfully create plan');
        }, () => {
          done();
        });
        const url = `/plans`;
        const method = 'POST';
        let req = httpMock.expectOne({url, method});
        req.flush(new ErrorEvent('error'));
        httpMock.verify();
      });
    });

    describe('Success', () => {
      it('should return valid ICreatePlanResponse if response is ok', (done) => {
        const createPlanRequest: ICreatePlanRequest = {
          customerNumber: 1,
          planName: 'Voluntary - unique name',
          coverageId: '1234',
          coverageName: 'Voluntary A & H',
          effectiveDate: '01/01/2000',
          ppcModelName: 'sample'
        };

        subscription = planDataService.createPlan(createPlanRequest).subscribe((res: ICreatePlanResponse) => {
          expect(res.planId).toBe('9999');
          expect(res.planName).toBe('Plan Name 99');
          expect(res.responseCode).toBe('SUCCESS');
          done();
        }, () => {
          done.fail('It should not call the error function');
        });

        const url = `/plans`;
        const method = 'POST';
        let req = httpMock.expectOne({url, method});
        req.flush(createPlanMockSuccessResponse);
        httpMock.verify();
      });
    });
  });

  describe('Get Plans', () => {
    it('should get a list of plans', () => {

      const planRequest: IPlanRequest = {
        customerNumber: 1,
        page: 1,
        pageSize: 10,
        sortBy: 'customerName',
        sortAsc: true
      };

      // Subscribe to result
      subscription = planDataService.searchPlans(planRequest).subscribe((planResponse: IPlanResponse) => {
        expect(planResponse).toBeTruthy();
      });

      const params = 'page=1&pageSize=10&sortBy=customerName&sortAsc=true';
      const url = `/customers/1/plans/filter`;
      const method = 'GET';
      const urlWithParams = `${url}?${params}`;

      // Expect Request
      const req = httpMock.expectOne(r => {
        return r.method === method && r.urlWithParams === urlWithParams;
      });

      // Mock Request
      req.flush({
        plans: [{planId: 1}],
        page: 1,
        pageSize: 10,
        totalCount: 1
      }
      );
      httpMock.verify();
    });
  });
});
