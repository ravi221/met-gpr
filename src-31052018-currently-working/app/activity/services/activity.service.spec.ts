import {TestBed} from '@angular/core/testing';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {ActivityService} from './activity.service';
import {Subscription} from 'rxjs/Subscription';
import {activity1, activity2} from '../../../assets/test/common-objects/activity.mock';

describe('ActivityService', () => {
  let service: ActivityService;
  let httpMock: HttpTestingController;
  let subscription: Subscription;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ActivityService]
    });
    service = TestBed.get(ActivityService);
    httpMock = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    if (subscription) {
      subscription.unsubscribe();
      subscription = null;
    }
  });

  describe('Getting recent customer plan updates', () => {
    it('should return a recent update when given a customer number', (done) => {

      subscription = service.getRecentCustomerPlanUpdate(activity1.customerNumber).subscribe((res: any) => {
        expect(res.attribute).toBeNull();
        expect(res.status).toBe('CREATED');
        expect(res.firstName).toBe('Matthew');
        expect(res.lastName).toBe('Rosner');
        done();
      }, () => {
        done.fail('It should not fail getting recent update');
      });

      const url = `/customers/${activity1.customerNumber}/plan/recentUpdate`;
      const method = 'GET';
      let req = httpMock.expectOne({url, method});
      req.flush(activity1);
      httpMock.verify();
    });

    it('should return a recent update when given a customer number and plan id', (done) => {
      subscription = service.getRecentCustomerPlanUpdate(activity1.customerNumber, '1').subscribe((res: any) => {
        expect(res.attribute).toBeNull();
        expect(res.status).toBe('CREATED');
        expect(res.firstName).toBe('Matthew');
        expect(res.lastName).toBe('Rosner');
        done();
      }, () => {
        done.fail('It should not fail getting recent update');
      });

      const url = `/customers/${activity1.customerNumber}/plan/recentUpdate`;
      const method = 'GET';
      const params = 'planId=1';
      const urlWithParams = `${url}?${params}`;

      // Expect Request
      const req = httpMock.expectOne(r => {
        return r.method === method && r.urlWithParams === urlWithParams;
      });

      req.flush(activity1);
      httpMock.verify();
    });
  });

  describe('Getting recent update message', () => {
    it('should get recent update message for an attribute', () => {
      const result = service.getRecentCustomerPlanUpdateMessage(activity2);
      expect(result).toBe('Attribute name in Voluntary - Critical Illness Test updated by ');
    });

    it('should get recent update message for a status', () => {
      const result = service.getRecentCustomerPlanUpdateMessage(activity1);
      expect(result).toBe('Voluntary - Test 1,1 CREATED by ');
    });

    describe('Empty recent updates', () => {
      it('should return empty string when attribute is null and status is null', () => {
        let activity = activity1;
        activity.attribute = null;
        activity.status = null;
        const result = service.getRecentCustomerPlanUpdateMessage(activity);
        expect(result).toBe('');
      });

      it('should return empty string when attribute is null and status is undefined', () => {
        let activity = activity1;
        activity.attribute = null;
        activity.status = undefined;
        const result = service.getRecentCustomerPlanUpdateMessage(activity);
        expect(result).toBe('');
      });

      it('should return empty string when attribute is undefined and status is null', () => {
        let activity = activity1;
        activity.attribute = undefined;
        activity.status = null;
        const result = service.getRecentCustomerPlanUpdateMessage(activity);
        expect(result).toBe('');
      });

      it('should return empty string when attribute is undefined and status is undefined', () => {
        let activity = activity1;
        activity.attribute = undefined;
        activity.status = undefined;
        const result = service.getRecentCustomerPlanUpdateMessage(activity);
        expect(result).toBe('');
      });

      it('should return empty string when attribute is empty and status is undefined', () => {
        let activity = activity1;
        activity.attribute = '';
        activity.status = undefined;
        const result = service.getRecentCustomerPlanUpdateMessage(activity);
        expect(result).toBe('');
      });

      it('should return empty string when attribute is empty and status is null', () => {
        let activity = activity1;
        activity.attribute = '';
        activity.status = null;
        const result = service.getRecentCustomerPlanUpdateMessage(activity);
        expect(result).toBe('');
      });

      it('should return empty string when attribute is empty and status is empty', () => {
        let activity = activity1;
        activity.attribute = '';
        activity.status = '';
        const result = service.getRecentCustomerPlanUpdateMessage(activity);
        expect(result).toBe('');
      });

      it('should return empty string when attribute is null and status is empty', () => {
        let activity = activity1;
        activity.attribute = null;
        activity.status = '';
        const result = service.getRecentCustomerPlanUpdateMessage(activity);
        expect(result).toBe('');
      });

      it('should return empty string when attribute is undefined and status is empty', () => {
        let activity = activity1;
        activity.attribute = undefined;
        activity.status = '';
        const result = service.getRecentCustomerPlanUpdateMessage(activity);
        expect(result).toBe('');
      });
    });
  });

  it('should call fire update observable when called', (done) => {
    subscription = service.update$.subscribe(() => {
        done();
      }, () => {
        done.fail('Should not fail when getting activity update');
      }
    );
    service.update();
  });
});
