import {TestBed} from '@angular/core/testing';
import {LogService} from '../../core/services/log.service';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {Subscription} from 'rxjs/Subscription';
import {HelpDataService} from './help-data.service';
import {IHelpText} from '../interfaces/iHelpText';
import {HttpClient, HttpResponse} from '@angular/common/http';

describe('HelpDataService', () => {
  let httpMock: HttpTestingController;
  let helpdataService: HelpDataService;
  let subscription: Subscription;

  let testHelpData = <IHelpText>{
    questionId: '1234',
    helpText: 'Test Help',
    urlText: 'gpr.metlife.com'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        HelpDataService,
        LogService,
      ]
    });
    helpdataService = TestBed.get(HelpDataService);
    httpMock = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    if (subscription) {
      subscription.unsubscribe();
    }
  });

  describe('Update HelpText', () => {
    it('Should send the correct data ', () => {
      subscription = helpdataService.updateHelpText(testHelpData).subscribe((response) => {
        expect(response).toBeTruthy();
      });

      const url = `/metadata/help`;
      const method = 'PUT';
      let mockResponse = new HttpResponse({status: 200, statusText: 'ok'});
      const req = httpMock.expectOne({url, method});
      req.flush(mockResponse);
      httpMock.verify();
    });
  });
});

