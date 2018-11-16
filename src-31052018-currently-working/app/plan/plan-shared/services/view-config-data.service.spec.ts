import * as data from '../../../../assets/test/metadata/AandH_view.mock.json';
import {TestBed, async, inject} from '@angular/core/testing';
import {ViewConfigDataService} from './view-config-data.service';
import {LogService} from '../../../core/services/log.service';
import {ProgressService} from '../../../ui-controls/services/progress.service';
import {NotificationService} from '../../../core/services/notification.service';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {HttpClientModule, HttpRequest} from '@angular/common/http';

describe('ViewConfigDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, HttpClientModule],
      providers: [
        ViewConfigDataService,
        NotificationService,
        ProgressService,
        LogService
      ]
    });
  });

  it('should be created', inject([ViewConfigDataService], (service: ViewConfigDataService) => {
    expect(service).toBeTruthy();
  }));

  it('should issue a get request with the getViewByCategory method',
    async(
      inject([ViewConfigDataService, HttpTestingController], (service: ViewConfigDataService, backend: HttpTestingController) => {
        service.getViewByCategory('207000', '0.20', 'planInfo').subscribe();

        backend.expectOne((req: HttpRequest<any>) => {
          return req.url === `/metadata/207000/0.20`
            && req.method === 'GET';
        }, `Get request to metadata/formId/version`);
      })
    )
  );

  it('should issue a get request with the getViewByCategory method',
    async(
      inject([ViewConfigDataService, HttpTestingController], (service: ViewConfigDataService, backend: HttpTestingController) => {
        service.getViewByPPCModel('207000', '0.20').subscribe();

        backend.expectOne((req: HttpRequest<any>) => {
          return req.url === `/metadata/207000/0.20`
            && req.method === 'GET';
        }, `Get request to metadata/formId/version`);
      })
    )
  );

  it('should throw an return 200 for view by category',
    async(
      inject([ViewConfigDataService, HttpTestingController], (service: ViewConfigDataService, backend: HttpTestingController) => {
        service.getViewByCategory('207000', '0.20', 'planInfo').subscribe((next) => {
          expect(next).toBeTruthy();
        });

        backend.expectOne('/metadata/207000/0.20').flush(data, {status: 200, statusText: 'ok'});
      })
    )
  );

  it('should throw an return 200 for view by coverage',
    async(
      inject([ViewConfigDataService, HttpTestingController], (service: ViewConfigDataService, backend: HttpTestingController) => {
        service.getViewByPPCModel('207000', '0.20').subscribe((next) => {
          expect(next).toBeTruthy();
        });

        backend.expectOne('/metadata/207000/0.20').flush(data, {status: 200, statusText: 'ok'});
      })
    )
  );
});
