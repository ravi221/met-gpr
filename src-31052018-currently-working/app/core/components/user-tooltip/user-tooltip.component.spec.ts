import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {DebugElement} from '@angular/core/src/debug/debug_node';
import {IUserInfo} from 'app/customer/interfaces/iUserInfo';
import {UserTooltipComponent} from 'app/core/components/user-tooltip/user-tooltip.component';
import {TooltipPositionService} from '../../../ui-controls/services/tooltip-position.service';
import {TooltipService} from '../../../ui-controls/services/tooltip.service';
import {TooltipDirective} from '../../../ui-controls/components/tooltip/tooltip.directive';
import {TooltipContentComponent} from '../../../ui-controls/components/tooltip/tooltip-content.component';
import {IconComponent} from '../../../ui-controls/components/icon/icon.component';
import {click} from '../../../../assets/test/TestHelper';

describe('UserTooltipComponent', () => {
  let component: UserTooltipComponent;
  let fixture: ComponentFixture<UserTooltipComponent>;
  let tooltip: DebugElement;
  let tooltipContent: DebugElement;

  let userInfo: IUserInfo = {
    firstName: 'Sunil',
    lastName: 'Yerkola',
    emailAddress: 'syerkola@metlife.com',
    metnetId: 'syerkola'
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UserTooltipComponent, TooltipDirective, TooltipContentComponent, IconComponent],
      providers: [TooltipService, TooltipPositionService]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(UserTooltipComponent);
        component = fixture.componentInstance;
        component.userInfo = userInfo;
        fixture.detectChanges();
        tooltip = fixture.debugElement.query(By.css('a'));
        tooltipContent = fixture.debugElement.query(By.css('.tooltip-content'));
      });
  }));


  afterEach(() => {
    if (fixture) {
      fixture.destroy();
    }
  });

  it('should display a user\'s information correctly', () => {
    click(tooltip, fixture);
    const userInfoEl = fixture.debugElement.query(By.css('.user-info'));
    const userName = userInfoEl.query(By.css('.user-name')).nativeElement.innerText;
    const userEmail = userInfoEl.query(By.css('.user-email')).nativeElement.innerText;
    const userMetNet = userInfoEl.query(By.css('.user-metnet')).nativeElement.innerText;
    expect(userName).toContain('Sunil Yerkola');
    expect(userEmail).toContain('syerkola@metlife.com');
    expect(userMetNet).toContain('syerkola');
  });
});
