import {TestBed} from '@angular/core/testing';

import {HttpInterceptorService} from './http-interceptor.service';
import {LogService} from './log.service';
import {ProgressService} from '../../ui-controls/services/progress.service';
import {NotificationService} from './notification.service';
import {UserProfileService} from './user-profile.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {LogoutService} from '../../navigation/services/logout.service';
import {Idle, IdleExpiry} from '@ng-idle/core';
import {MockIdleExpiry} from 'app/core/services/idle-expiry.mock';
import {AuthorizationService} from './authorization.service';
import {LoadingSpinnerService} from '../../ui-controls/services/loading-spinner.service';

describe('HttpInterceptorService', () => {
  let service: HttpInterceptorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        HttpInterceptorService,
        NotificationService,
        ProgressService,
        LogService,
        UserProfileService,
        LogoutService,
        Idle,
        LoadingSpinnerService,
        {provide: IdleExpiry, useClass: MockIdleExpiry},
        AuthorizationService
      ]
    });
    service = TestBed.get(HttpInterceptorService);
  });

  it('should create only allowed headers', () => {
    const allowableHeaders = [
      'System',
      'UserId',
      'Content-Type',
      'Accept',
      'X-Request-Id'
    ];

    const headers = service.getRequestHeaders('0');
    for (let header in headers) {
      if (headers.hasOwnProperty(header)) {
        expect(allowableHeaders).toContain(header);
      }
    }
  });
});
