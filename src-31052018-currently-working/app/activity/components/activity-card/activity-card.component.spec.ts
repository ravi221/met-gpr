import {ActivityService} from '../../services/activity.service';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {CardComponent} from 'app/ui-controls/components/card/card.component';
import {Component, DebugElement, ViewChild} from '@angular/core';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {IActivity} from '../../interfaces/iActivity';
import {IconComponent} from '../../../ui-controls/components/icon/icon.component';
import {IUserInfo} from '../../../customer/interfaces/iUserInfo';
import {LoadingIconComponent} from 'app/ui-controls/components/loading-icon/loading-icon.component';
import {NavigatorService} from '../../../navigation/services/navigator.service';
import {RouterTestingModule} from '@angular/router/testing';
import {TooltipContentComponent} from '../../../ui-controls/components/tooltip/tooltip-content.component';
import {TooltipDirective} from '../../../ui-controls/components/tooltip/tooltip.directive';
import {TooltipPositionService} from '../../../ui-controls/services/tooltip-position.service';
import {TooltipService} from '../../../ui-controls/services/tooltip.service';
import {UserTooltipComponent} from '../../../core/components/user-tooltip/user-tooltip.component';
import {DetailCardComponent} from '../../../ui-controls/components/detail-card/detail-card.component';
import {ActivityCardComponent} from '../activity-card/activity-card.component';
import {MockNavigatorService} from '../../../navigation/services/navigator.service.mock';

describe('ActivityCardComponent', () => {
  let component: TestActivityCardComponent;
  let fixture: ComponentFixture<TestActivityCardComponent>;
  let activityService: ActivityService;
  let activityText: DebugElement;
  let activity: IActivity = {
    customerNumber: 1234567,
    planId: '136181520257786893',
    planName: 'Voluntary - Test1',
    status: 'UPDATED',
    attribute: null,
    timestamp: '03-05-2018 09:07:01.316',
    firstName: 'Matthew',
    lastName: 'Rosner',
    emailId: 'mrosner@metlife.com',
    metnetId: 'mrosner1',
    totalFlagCount: 0
  };
  let userInfo: IUserInfo = {
    firstName: 'Matthew',
    lastName: 'Rosner',
    emailAddress: 'mrosner@metlife.com',
    metnetId: 'mrosner1'
  };

  function setup(hasActivity: boolean = true) {
    component.activityCard.hasActivity = hasActivity;
    component.activityCard.activity = activity;
    component.activityCard.userInfo = userInfo;
    component.activityCard.recentCustomerPlanUpdateMessage = activityService.getRecentCustomerPlanUpdateMessage(activity);
    fixture.detectChanges();
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      declarations: [
        ActivityCardComponent,
        CardComponent,
        IconComponent,
        LoadingIconComponent,
        TestActivityCardComponent,
        TooltipContentComponent,
        TooltipDirective,
        UserTooltipComponent,
        DetailCardComponent
      ],
      providers: [
        ActivityService,
        TooltipPositionService,
        TooltipService,
        {provide: NavigatorService, useClass: MockNavigatorService}
      ]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(TestActivityCardComponent);
        component = fixture.componentInstance;
        component.activityCard.activity = activity;
        component.activityCard.userInfo = userInfo;
        fixture.detectChanges();
        activityService = TestBed.get(ActivityService);
      });
  }));

  afterEach(() => {
    if (fixture) {
      fixture.destroy();
    }
  });

  describe('Customer plan update', () => {
    it('check recent customer plan message', () => {
      setup();
      let message = fixture.debugElement.query(By.css('.activity-text'));
      expect(message.nativeElement.innerText).toContain('Voluntary - Test1 UPDATED by');
    });

    it('check timestamp', () => {
      setup();
      activityText = fixture.debugElement.query(By.css('.timestamp'));
      expect(activityText.nativeElement.innerHTML).toBe('03/05/18 9:07 AM');
    });
  });

  it('should not display the activity card when show activity is false', () => {
    setup(false);
    const activityCard = fixture.debugElement.query(By.css('.activity-card'));
    expect(activityCard).toBeNull();
  });

  @Component({
    template: `
      <gpr-activity-card [customer]="customer"></gpr-activity-card>
    `
  })
  class TestActivityCardComponent {
    public customer = {
      customerName: 'test',
      customerNumber: 1234567,
      effectiveDate: null,
      status: 'U',
      percentageCompleted: 50,
      market: 'Small Market',
      scrollVisibility: true
    };
    @ViewChild(ActivityCardComponent) activityCard;
  }

});
