import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {MassUpdateLandingComponent} from './mass-update-landing.component';
import {ActivatedRoute, Router} from '@angular/router';
import {BreadcrumbsStubComponent} from 'app/navigation/components/breadcrumbs/breadcrumbs.component.stub';
import {NavigatorService} from 'app/navigation/services/navigator.service';
import {planContext} from 'assets/test/common-objects/navigation-objects';
import {TooltipService} from 'app/ui-controls/services/tooltip.service';
import {TooltipPositionService} from 'app/ui-controls/services/tooltip-position.service';
import {TooltipDirective} from 'app/ui-controls/components/tooltip/tooltip.directive';
import {TooltipContentComponent} from 'app/ui-controls/components/tooltip/tooltip-content.component';
import {CardStubComponent} from 'app/ui-controls/components/card/card.component.stub';
import {LoadingIconComponent} from 'app/ui-controls/components/loading-icon/loading-icon.component';
import {IconComponent} from 'app/ui-controls/components/icon/icon.component';
import {ActivityCardStubComponent} from 'app/activity/components/activity-card/activity-card.component.stub';
import {DetailCardComponent} from 'app/ui-controls/components/detail-card/detail-card.component';
import {UserTooltipComponent} from 'app/core/components/user-tooltip/user-tooltip.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {click} from 'assets/test/TestHelper';
import { FlagCardStubComponent } from 'app/flag/components/flag-card/flag-card.component.stub';
import {MockNavigatorService, MockRouter} from 'app/navigation/services/navigator.service.mock';
import {MassUpdateSelectPlansTooltipComponent} from 'app/plan/mass-update/components/mass-update-select-plans-tooltip/mass-update-select-plans-tooltip.component';
import {MassUpdateDataService} from 'app/plan/mass-update/services/mass-update-data.service';
import {MockUserProfileService} from 'app/core/services/user-profile-service-mock';
import {UserProfileService} from 'app/core/services/user-profile.service';
import {PageAccessService} from 'app/core/services/page-access.service';



describe('MassUpdateLandingComponent', () => {
  let component: MassUpdateLandingComponent;
  let fixture: ComponentFixture<MassUpdateLandingComponent>;
  let routeStub;
  const mockRouter = new MockRouter();

  beforeEach(async(() => {
    routeStub = {
      data: {
        customer: {
          customerNumber: 1
        },
        currentUser: null
      }
    };
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [
        MassUpdateLandingComponent,
        BreadcrumbsStubComponent,
        CardStubComponent,
        LoadingIconComponent,
        IconComponent,
        ActivityCardStubComponent,
        DetailCardComponent,
        UserTooltipComponent,
        TooltipDirective,
        TooltipContentComponent,
        FlagCardStubComponent,
        MassUpdateSelectPlansTooltipComponent
      ],
      providers: [
        MassUpdateDataService,
        TooltipService,
        TooltipPositionService,
        PageAccessService,
        {provide: NavigatorService, useClass: MockNavigatorService},
        {provide: UserProfileService, useClass: MockUserProfileService},
        {provide: Router, useValue: mockRouter},
        {provide: ActivatedRoute, useValue: routeStub}
      ]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(MassUpdateLandingComponent);
        component = fixture.componentInstance;
        component.customer = planContext.data.customer;
        fixture.detectChanges();
      });
  }));

  describe('category label', () => {
    it('should be New Plan', () => {
      expect(component.categoryInfo[0].label).toBe('New Plan');
    });

    it('should be Eligibility Provisions', () => {
      expect(component.categoryInfo[1].label).toBe('Eligibility Provisions');
    });

    it('should be ERISA Information & HIPAA', () => {
      expect(component.categoryInfo[2].label).toBe('ERISA Information & HIPAA');
    });
  });
});
