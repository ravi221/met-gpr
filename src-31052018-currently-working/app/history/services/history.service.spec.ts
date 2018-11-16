import {TestBed} from '@angular/core/testing';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {HistoryService} from './history.service';
import {Subscription} from 'rxjs/Subscription';
import * as mockActivity from '../../../assets/test/activity/activityTest.mock.json';
import {Observable} from 'rxjs/Observable';

describe('HistoryService', () => {
  let service: HistoryService;
  let httpMock: HttpTestingController;
  let subscription: Subscription;
  let historyService: HistoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [HistoryService]
    });
    service = TestBed.get(historyService);
  });
});
