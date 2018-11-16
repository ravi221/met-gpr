import {BuildVersionService} from './build-version.service';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {Subscription} from 'rxjs/Subscription';
import {TestBed} from '@angular/core/testing';

describe('BuildVersionService', () => {
  let service: BuildVersionService;
  let httpMock: HttpTestingController;
  let subscription: Subscription;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [BuildVersionService]
    });
    service = TestBed.get(BuildVersionService);
    httpMock = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    if (subscription) {
      subscription.unsubscribe();
      subscription = null;
    }
  });

  it('should get the build version', () => {
    subscription = service.getBuildVersion().subscribe((buildVersion: string) => {
      expect(buildVersion).toBe('local');
    });

    const url = `assets/build-version.json`;
    const method = 'GET';
    let req = httpMock.expectOne({url, method});
    req.flush({buildVersion: 'local'});
    httpMock.verify();
  });

  it('should return a default value when getting build version fails', () => {
    subscription = service.getBuildVersion().subscribe((buildVersion: string) => {
      expect(buildVersion).toBe('-');
    });

    const url = `assets/build-version.json`;
    const method = 'GET';
    let req = httpMock.expectOne({url, method});
    let err = new ErrorEvent('ERROR', {
      error: new Error()
    });
    req.error(err);
    httpMock.verify();
  });
});
