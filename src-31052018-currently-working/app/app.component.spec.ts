import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AppComponent} from './app.component';
import {UserProfileService} from './core/services/user-profile.service';
import {AuthorizationService} from './core/services/authorization.service';
import {LogoutService} from './navigation/services/logout.service';
import {ModalService} from './ui-controls/services/modal.service';
import {MockUserProfileService} from 'app/core/services/user-profile-service-mock';
import {MockIdleExpiry} from './core/services/idle-expiry.mock';
import {Idle, IdleExpiry} from '@ng-idle/core';
import {BrowserDynamicTestingModule} from '@angular/platform-browser-dynamic/testing';
import {ModalBackdropComponent} from './ui-controls/components/modal/modal-backdrop/modal-backdrop.component';
import {ModalContainerComponent} from './ui-controls/components/modal/modal-container/modal-container.component';
import {NotificationService} from './core/services/notification.service';
import {NotificationTypes} from './core/models/notification-types';
import {MainMenuNavStubComponent} from './navigation/components/main-nav-menu.component.stub';
import {ScrollToTopStubComponent} from './ui-controls/components/scroll-to-top/scroll-to-top.component.stub';
import {SearchOverlayStubComponent} from './search/components/search-overlay/search-overlay.component.stub';
import {SlideMenuStubComponent} from './ui-controls/components/slide-menu/slide-menu.component.stub';
import {NavBarStubComponent} from './navigation/components/nav-bar/nav-bar.component.stub';
import {NotificationBannerStubComponent} from './ui-controls/components/notification-banner/notification-banner.component.stub';
import {RouterOutletStubComponent} from './routing/router-outlet.component.stub';
import {IconComponent} from './ui-controls/components/icon/icon.component';
import {LoadingSpinnerStubComponent} from './ui-controls/components/loading-spinner/loading-spinner.component.stub';
import {LoadingSpinnerService} from './ui-controls/services/loading-spinner.service';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;
  let notificationService: NotificationService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        NavBarStubComponent,
        SlideMenuStubComponent,
        SearchOverlayStubComponent,
        ScrollToTopStubComponent,
        MainMenuNavStubComponent,
        NotificationBannerStubComponent,
        RouterOutletStubComponent,
        ModalContainerComponent,
        ModalBackdropComponent,
        IconComponent,
        LoadingSpinnerStubComponent
      ],
      providers: [
        AuthorizationService,
        LogoutService,
        Idle,
        ModalService,
        NotificationService,
        LoadingSpinnerService,
        {provide: IdleExpiry, useClass: MockIdleExpiry},
        {provide: UserProfileService, useClass: MockUserProfileService}
      ]
    });
    TestBed.overrideModule(BrowserDynamicTestingModule, {
      set: {
        entryComponents: [ModalContainerComponent, ModalBackdropComponent]
      }
    });
    spyOn(TestBed.get(AuthorizationService), 'isUserAuthorized').and.returnValue(true);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    notificationService = TestBed.get(NotificationService);
  });

  it('should update notification when a new notification arrives', () => {
    expect(component.notification).toBeUndefined();

    const notificationType = NotificationTypes.SUCCESS;
    const notificationMessage = 'Success!';
    notificationService.addNotification(notificationType, notificationMessage);
    fixture.whenStable().then(() => {
      expect(component.notification.type).toBe(notificationType);
      expect(component.notification.message).toBe(notificationMessage);
    });
  });
});
