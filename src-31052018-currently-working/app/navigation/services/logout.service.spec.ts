import {TestBed} from '@angular/core/testing';
import {LogoutService} from './logout.service';
import {Idle, IdleExpiry} from '@ng-idle/core';
import {MockIdleExpiry} from '../../core/services/idle-expiry.mock';

describe('LogoutService', () => {
  let service: LogoutService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        Idle,
        LogoutService,
        {provide: IdleExpiry, useClass: MockIdleExpiry}]
    });
    service = TestBed.get(LogoutService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should start the idle timer', () => {
    expect(service.isUserIdleTimerRunning()).toBeTruthy();
  });
});
