import {Subscription} from 'rxjs/Subscription';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {MassUpdateDataService} from './mass-update-data.service';
import {TestBed} from '@angular/core/testing';
import {HttpResponse} from '@angular/common/http';
import {MockUserProfileService} from '../../../core/services/user-profile-service-mock';
import {UserProfileService} from '../../../core/services/user-profile.service';
import {PageAccessService} from '../../../core/services/page-access.service';

describe('MassUpdateDataService', () => {
  let httpMock: HttpTestingController;
  let massUpdateDataService: MassUpdateDataService;
  let subscription: Subscription;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        MassUpdateDataService, {provide: UserProfileService, useClass: MockUserProfileService}, PageAccessService
      ]
    });
    massUpdateDataService = TestBed.get(MassUpdateDataService);
    httpMock = TestBed.get(HttpTestingController);
  });

  describe('Successful Response', () => {
    it('should return Success message if response is successfull', (done) => {
      subscription = massUpdateDataService.getViewByMassCategory('PPC_MUT', 0.1, 'newPlan').subscribe((res: any) => {
        expect(res.statusText).toBe('Success');
        done();
      }, () => {
        done.fail('Should not call error function when getting a response');
      });
      let mockResponse = new HttpResponse({status: 200, statusText: 'Success'});
      const reqStub = httpMock.expectOne({method: 'GET'});
      reqStub.flush(mockResponse);
      httpMock.verify();
    });

    it('should get the correct data', () => {
      subscription = massUpdateDataService.getViewByMassCategory('PPC_MUT', 0.1, 'newPlan').subscribe((data) => {
        expect(data).toBeTruthy();
      });

      const url = `/metadata/PPC_MUT/0.1`;
      const method = 'GET';

      const req = httpMock.expectOne(r => {
        return r.method === method && r.urlWithParams === url;
      });

      req.flush({
        ppcModelName: 'PPC_MUT',
        ppcVersion: 0.1,
        categoryId: 'newPlan'
      });
      httpMock.verify();
    });
  });

  describe('Error', () => {
    it('should return Error Message if response is not successfull', (done) => {
      subscription = massUpdateDataService.getViewByMassCategory('PPC_MUT', 0.1, 'newPlan').subscribe((res: any) => {
        expect(res.statusText).toBe('Error');
        done();
      }, () => {
        done.fail('Should not call error function when getting a response');
      });
      let mockResponse = new HttpResponse({status: 400, statusText: 'Error'});
      const reqStub = httpMock.expectOne({method: 'GET'});
      reqStub.flush(mockResponse);
      httpMock.verify();
    });

    it('should return error if mass update category request failed', (done) => {
      subscription = massUpdateDataService.getViewByMassCategory('PPC_MUT', 0.1, 'newPlan').subscribe(() => {
        done.fail('Should not successfully call mass update data');
      }, (error) => {
        expect(error).toContain('writing test cases for mass update servcie!');
        done();
      });

      let url = `/metadata/PPC_MUT/0.1`;
      let req = httpMock.expectOne(url);
      let err = new ErrorEvent('ERROR_COPYING_PLAN', {
        error: new Error('AAAHHHH'),
          message: 'writing test cases for mass update servcie!'
        });
        req.error(err, {status: 400, statusText: err.message});
        httpMock.verify();
    });
  });
});
