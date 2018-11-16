import {TestBed} from '@angular/core/testing';

import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {Subscription} from 'rxjs/Subscription';
import {flagResponse} from '../../../assets/test/common-objects/flags.mock';
import {IFlagsRequest} from '../interfaces/iFlagsRequest';
import { FlagService } from './flag.service';
import { PageAccessType } from 'app/core/enums/page-access-type';
import { debug } from 'util';
import { IFlagResolveRequest } from '../interfaces/iFlagResolveRequest';

describe('FlagService', () => {
  let service: FlagService;
  let subscription: Subscription;
  let httpMock: HttpTestingController;
  let mockFlagRequest: IFlagsRequest;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [FlagService]
    });
    service = TestBed.get(FlagService);
    httpMock = TestBed.get(HttpTestingController);
    mockFlagRequest = {
      customerNumber: 1118090,
      isResolved: String(false),
      planId: '',
      coverages: []
    };
  });

  afterEach(() => {
    if (subscription) {
      subscription.unsubscribe();
      subscription = null;
    }
  });

  describe('Getting flags', () => {
    it('should return list of plans with flags for a customer', () => {
      subscription = service.getPlansWithFlags(mockFlagRequest).subscribe((res: any) => {
        expect(res.totalFlagCount).toBe(9);
        expect(res.plans.length).toBe(4);
        expect(res.plans[0].flags.length).toBe(5);
      }, () => {
      });
      const reqStub = httpMock.expectOne({method: 'GET'});
      reqStub.flush(flagResponse);
      httpMock.verify();
    });

    it('should return error message for empty customer id', (done) => {
      mockFlagRequest.customerNumber = null;
      subscription = service.getPlansWithFlags(mockFlagRequest).subscribe(() => {
        done.fail('Should not return flags without valid customer ID');
      }, (error: any) => {
        expect(error).toBe('Customer ID is required');
        done();
      });
    });
  });

  describe('resolve flags', () => {
    it('should return success if resolved', () => {
      mockFlagRequest.customerNumber = null;
      let resolveFlagRequest = <IFlagResolveRequest>{
        customerNumber: 1234,
        planId: '123',
        shouldRetain: false
      };
      subscription = service.resolveFlag(resolveFlagRequest).subscribe((res: any) => {
        expect(res.error).toBe('Failed to resolve flag');
      });

      const reqStub = httpMock.expectOne({method: 'POST'});
      reqStub.flush('Failed to resolve flag');
      httpMock.verify();
    });
  });

  describe('Updating flags', () => {
    it('should notify observers to update flags when a flag is created', (done) => {
      subscription = service.update$.subscribe(() => {
        done();
      }, () => {
        done.fail('It should not fail notifiying observers');
      });
      service.update();
    });
  });
  describe('can add flag comments', () => {
    it('if user access can add comments and flags', () => {
        expect(service.canAddFlagComment(PageAccessType.READ_ONLY)).toBeFalsy();
    });
  });
});
