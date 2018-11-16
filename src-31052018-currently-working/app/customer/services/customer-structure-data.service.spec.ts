import {TestBed} from '@angular/core/testing';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {Subscription} from 'rxjs/Subscription';
import {CustomerStructureDataService} from './customer-structure-data.service';
import {ICustomerStructureRequest} from '../interfaces/iCustomerStructureRequest';
import {ICustomerStructure} from '../interfaces/iCustomerStructure';
import * as mockExperiences from '../../../assets/test/customers/structure/customer-experiences.mock.json';
import * as mockReports from '../../../assets/test/customers/structure/customer-reports.mock.json';
import * as mockSubCodes from '../../../assets/test/customers/structure/customer-sub-codes.mock.json';
import * as mockClaimBranches from '../../../assets/test/customers/structure/customer-claim-branches.mock.json';

describe('CustomerStructureDataService', () => {
  let service: CustomerStructureDataService;
  let httpMock: HttpTestingController;
  let subscription: Subscription;
  let mockStructureRequest: ICustomerStructureRequest;
  const url = '/customers/1234567/structure';
  const method = 'GET';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        CustomerStructureDataService
      ]
    });
    service = TestBed.get(CustomerStructureDataService);
    httpMock = TestBed.get(HttpTestingController);
    mockStructureRequest = {
      customerNumber: 1234567
    };
  });

  afterEach(() => {
    if (subscription) {
      subscription.unsubscribe();
      subscription = null;
    }
  });

  describe('Get structure information', () => {
    it('should get all experience information', (done) => {
      subscription = service.getStructure(mockStructureRequest).subscribe((structures: ICustomerStructure[]) => {
        expect(structures).toBeTruthy();
        expect(structures).toEqual(mockExperiences['structures']);
        done();
      }, () => {
        done.fail('Should not fail call');
      });

      // Expect Request
      const req = httpMock.expectOne(r => {
        return r.method === method && r.urlWithParams === url;
      });
      req.flush(mockExperiences);
      httpMock.verify();
    });

    it('should get all report information', (done) => {
      const experience = '100';
      mockStructureRequest.experience = experience;
      subscription = service.getStructure(mockStructureRequest).subscribe((structures: ICustomerStructure[]) => {
        expect(structures).toBeTruthy();
        expect(structures).toEqual(mockReports['structures']);
        done();
      }, () => {
        done.fail('Should not fail call');
      });

      const params = `experience=${experience}`;
      const urlWithParams = `${url}?${params}`;
      const req = httpMock.expectOne(r => {
        return r.method === method && r.urlWithParams === urlWithParams;
      });
      req.flush(mockReports);
      httpMock.verify();
    });

    it('should get all sub code information', (done) => {
      const experience = '100';
      const report = '200';
      mockStructureRequest.experience = experience;
      mockStructureRequest.report = report;
      subscription = service.getStructure(mockStructureRequest).subscribe((structures: ICustomerStructure[]) => {
        expect(structures).toBeTruthy();
        expect(structures).toEqual(mockSubCodes['structures']);
        done();
      }, () => {
        done.fail('Should not fail call');
      });

      const params = `experience=${experience}&report=${report}`;
      const urlWithParams = `${url}?${params}`;
      const req = httpMock.expectOne(r => {
        return r.method === method && r.urlWithParams === urlWithParams;
      });
      req.flush(mockSubCodes);
      httpMock.verify();
    });

    it('should get all claim branch information', (done) => {
      const experience = '100';
      const report = '200';
      const subCode = '300';
      mockStructureRequest.experience = experience;
      mockStructureRequest.report = report;
      mockStructureRequest.subCode = subCode;
      subscription = service.getStructure(mockStructureRequest).subscribe((structures: ICustomerStructure[]) => {
        expect(structures).toBeTruthy();
        expect(structures).toEqual(mockClaimBranches['structures']);
        done();
      }, () => {
        done.fail('Should not fail call');
      });

      const params = `experience=${experience}&report=${report}&subCode=${subCode}`;
      const urlWithParams = `${url}?${params}`;
      const req = httpMock.expectOne(r => {
        return r.method === method && r.urlWithParams === urlWithParams;
      });
      req.flush(mockClaimBranches);
      httpMock.verify();
    });
  });
});
