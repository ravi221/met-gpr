import {ComponentFixture, TestBed} from '@angular/core/testing';

import {LogoutComponent} from './logout.component';
import {LogoutService} from '../../services/logout.service';
import {ActiveModalRef} from '../../../ui-controls/classes/modal-references';
import {Idle, IdleExpiry} from '@ng-idle/core';
import {MockIdleExpiry} from '../../../core/services/idle-expiry.mock';

describe('LogoutComponent', () => {
  let component: LogoutComponent;
  let fixture: ComponentFixture<LogoutComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LogoutComponent],
      providers: [
        ActiveModalRef,
        Idle,
        LogoutService,
        {provide: IdleExpiry, useClass: MockIdleExpiry}]
    });
    fixture = TestBed.createComponent(LogoutComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
