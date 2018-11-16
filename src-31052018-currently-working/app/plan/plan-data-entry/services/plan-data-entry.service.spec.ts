import {Subscription} from 'rxjs/Subscription';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {PlanDataEntryService} from './plan-data-entry.service';
import {TestBed} from '@angular/core/testing';
import {MockUserProfileService} from '../../../core/services/user-profile-service-mock';
import {UserProfileService} from '../../../core/services/user-profile.service';
import {PageAccessService} from '../../../core/services/page-access.service';


describe('Plan Data Entry Service', () => {
  let httpMock: HttpTestingController;
  let planDataService: PlanDataEntryService;
  let subscription: Subscription;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        PlanDataEntryService, {provide: UserProfileService, useClass: MockUserProfileService}, PageAccessService
      ]
    });
    planDataService = TestBed.get(PlanDataEntryService);
    httpMock = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    if (subscription) {
      subscription.unsubscribe();
    }
  });

  describe('Get Plan Category data', () => {
    it('should get the correct data', () => {

      subscription = planDataService.getPlanCategoryData('1', 'test').subscribe((data) => {
        expect(data).toBeTruthy();
      });

      const url = `/plans/1/categories/test`;
      const method = 'GET';

      const req = httpMock.expectOne(r => {
        return r.method === method && r.urlWithParams === url;
      });

      req.flush({
        planId: 1,
        categoryId: 'test',
        questions: {}
      });
      httpMock.verify();
    });
  });

  describe('Update Plan Data', () => {
    it('should send the correct data', () => {
      const payload = {
        customerNumber: 5001107,
        questions: [
          'personalDependentCode: B',
          'planFinancialArrangementCode: AO'
        ],
        sections: [
          {
            completedFieldCount: 0,
            completionPercentage: 0,
            sectionId: 'planDetails',
            sectionName: 'Plan Details',
            totalFieldCount: 0,
            validationIndicator: 'false'
          }
        ],
        status: 'Inprogress'
      };

      subscription = planDataService.save('1', payload).subscribe((response) => {
        expect(response).toBeTruthy();
      });

      const url = `/plans/1`;
      const method = 'PUT';

      const req = httpMock.expectOne((r) => {
        return r.method === method && r.url === url;
      });
      req.flush(payload, {status: 200, statusText: 'ok'});

      httpMock.verify();
    });
  });

});

