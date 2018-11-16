import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {By} from '@angular/platform-browser';
import {Component, DebugElement, ViewChild} from '@angular/core';
import {NotificationBannerComponent} from './notification-banner.component';
import {INotification} from '../../../core/interfaces/iNotification';
import {NotificationTypes} from '../../../core/models/notification-types';
import {IconComponent} from '../icon/icon.component';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {AnimationState} from '../../animations/AnimationState';

describe('NotificationBannerComponent', () => {
  let component: TestNotificationBannerComponent;
  let fixture: ComponentFixture<TestNotificationBannerComponent>;
  let notificationElement: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule],
      declarations: [
        IconComponent,
        NotificationBannerComponent,
        TestNotificationBannerComponent
      ]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(TestNotificationBannerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        notificationElement = fixture.debugElement.query(By.css('.notification-banner'));
      });
  }));

  afterEach(() => {
    if (fixture) {
      fixture.destroy();
    }
  });

  it('should render banner when notification is present', () => {
    const spy = spyOn(component.banner, 'showBanner').and.callThrough();
    component.banner.ngOnChanges();
    expect(component.banner.state).toBe(AnimationState.VISIBLE);
    expect(spy).toHaveBeenCalled();
  });

  it('should not render banner when notification is null', () => {
    component.notification = null;
    const spy = spyOn(component.banner, 'showBanner').and.callThrough();
    fixture.detectChanges();
    expect(component.banner.state).toBe(AnimationState.HIDDEN);
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith(false);
  });

  it('should close banner when click on banner', () => {
    const spy = spyOn(component.banner, 'showBanner').and.callThrough();
    expect(component.banner.state).toBe(AnimationState.VISIBLE);
    fixture.nativeElement.click();
    fixture.detectChanges();
    expect(component.banner.state).toBe(AnimationState.HIDDEN);
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith(false);
  });

  @Component({
    template: '<gpr-notification-banner [notification]="notification" ></gpr-notification-banner> '
  })
  class TestNotificationBannerComponent {
    @ViewChild(NotificationBannerComponent) banner;
    public notification: INotification = {
      id: '1',
      message: 'Test Banner',
      type: NotificationTypes.ERROR
    };
  }
});
