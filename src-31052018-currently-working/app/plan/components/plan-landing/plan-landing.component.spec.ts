import {ActivityCardComponent} from '../../../activity/components/activity-card/activity-card.component';
import {ActivityService} from '../../../activity/services/activity.service';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {BreadcrumbsComponent} from '../../../navigation/components/breadcrumbs/breadcrumbs.component';
import {BreadcrumbService} from 'app/navigation/services/breadcrumb.service';
import {BrowserDynamicTestingModule} from '@angular/platform-browser-dynamic/testing';
import {CardComponent} from '../../../ui-controls/components/card/card.component';
import {LoadingIconComponent} from '../../../ui-controls/components/loading-icon/loading-icon.component';
import {PlanContextMenuComponent} from '../plan-context-menu/plan-context-menu.component';
import {PlanCategoryListComponent} from '../plan-category-list/plan-category-list.component';
import {IconComponent} from '../../../ui-controls/components/icon/icon.component';
import {PlanContextMenuService} from '../../services/plan-context-menu.service';
import {TooltipService} from '../../../ui-controls/services/tooltip.service';
import {TooltipPositionService} from '../../../ui-controls/services/tooltip-position.service';
import {TooltipDirective} from '../../../ui-controls/components/tooltip/tooltip.directive';
import {TooltipContentComponent} from '../../../ui-controls/components/tooltip/tooltip-content.component';
import {PlanDataService} from '../../plan-shared/services/plan-data.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {MockNavigatorService} from '../../../navigation/services/navigator.service.mock';
import {ModalBackdropComponent} from '../../../ui-controls/components/modal/modal-backdrop/modal-backdrop.component';
import {ModalContainerComponent} from '../../../ui-controls/components/modal/modal-container/modal-container.component';
import {UserTooltipComponent} from '../../../core/components/user-tooltip/user-tooltip.component';
import {PlanErrorTooltipComponent} from 'app/plan/components/plan-error-tooltip/plan-error-tooltip.component';
import {PlanCategorySectionListComponent} from 'app/plan/components/plan-category-section-list/plan-category-section-list.component';
import {PlanCategorySectionListTemplateComponent} from 'app/plan/components/plan-category-section-list-template/plan-category-section-list-template.component';
import {planContext} from '../../../../assets/test/common-objects/navigation-objects';
import {PlanLandingAction} from 'app/plan/enums/plan-entry-action';
import {PlanLandingComponent} from './plan-landing.component';
import {QuickLinksStubComponent} from '../../../core/components/quick-links/quick-links.component.stub';
import { FlagCardComponent } from 'app/flag/components/flag-card/flag-card.component';
import { FlagResolverTooltipComponent } from 'app/flag/components/flag-resolver-tooltip/flag-resolver-tooltip.component';
import { FlagService } from 'app/flag/services/flag.service';
import { DebugElement } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { DetailCardComponent } from 'app/ui-controls/components/detail-card/detail-card.component';
import { ExpandCollapseIconComponent } from 'app/ui-controls/components/expand-collapse-icon/expand-collapse-icon.component';
import { ValidatePlanStubComponent } from 'app/plan/plan-shared/components/validate-plan/validate-plan.component.stub';
import { PagingService } from 'app/ui-controls/services/paging.service';
import { ScrollService } from 'app/ui-controls/services/scroll.service';
import { NavigatorService } from 'app/navigation/services/navigator.service';
import { ViewConfigDataService } from 'app/plan/plan-shared/services/view-config-data.service';
import { ModalService } from 'app/ui-controls/services/modal.service';
import { NotificationService } from 'app/core/services/notification.service';
import { UserPreferencesService } from 'app/core/services/user-preferences.service';
import { UserProfileService } from 'app/core/services/user-profile.service';
import { AuthorizationService } from 'app/core/services/authorization.service';
import { SortOptionsService } from 'app/core/services/sort-options.service';
import { DEFAULT_USER_ROLE } from '../../../../assets/test/common-objects/user-profile.mock';

describe('PlanLandingComponent', () => {
  let component: PlanLandingComponent;
  let fixture: ComponentFixture<PlanLandingComponent>;
  let validateBtn: DebugElement;
  let userProfileServiceSpy: jasmine.Spy;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      declarations: [
        PlanLandingComponent,
        BreadcrumbsComponent,
        CardComponent,
        LoadingIconComponent,
        PlanContextMenuComponent,
        PlanCategoryListComponent,
        ActivityCardComponent,
        FlagCardComponent,
        IconComponent,
        TooltipDirective,
        TooltipContentComponent,
        FlagResolverTooltipComponent,
        ModalContainerComponent,
        ModalBackdropComponent,
        UserTooltipComponent,
        PlanErrorTooltipComponent,
        PlanCategorySectionListComponent,
        PlanCategorySectionListTemplateComponent,
        DetailCardComponent,
        ValidatePlanStubComponent,
        ExpandCollapseIconComponent,
        QuickLinksStubComponent
      ],
      providers: [
        PlanContextMenuService,
        TooltipService,
        TooltipPositionService,
        PlanDataService,
        PagingService,
        ScrollService,
        {provide: NavigatorService, useClass: MockNavigatorService},
        ViewConfigDataService,
        ModalService,
        ActivityService,
        FlagService,
        BreadcrumbService,
        NotificationService,
        UserPreferencesService,
        UserProfileService,
        AuthorizationService,
        SortOptionsService
      ]
    });
    TestBed.overrideModule(BrowserDynamicTestingModule, {
      set: {
        entryComponents: [ModalContainerComponent, ModalBackdropComponent]
      }
    });
  }));

  beforeEach(() => {
    userProfileServiceSpy = spyOn(TestBed.get(UserProfileService), 'getRoles').and.returnValue(DEFAULT_USER_ROLE);
    fixture = TestBed.createComponent(PlanLandingComponent);
    component = fixture.componentInstance;
    component.plan = planContext.data.plan;
    component.customer = planContext.data.customer;
    fixture.detectChanges();
  });
  afterEach(() => {
    if (fixture) {
      fixture.destroy();
    }
    if (userProfileServiceSpy) {
      userProfileServiceSpy = null;
    }
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Testing onCategorySelect', () => {
    it('should navigate to plan entry when action is \'VALIDATE\'', () => {
      const spy = spyOn(TestBed.get(NavigatorService), 'goToPlanEntry').and.stub();
      component.onCategorySelect({action: PlanLandingAction.VALIDATE, category: {categoryId: 1}});
      expect(spy).not.toHaveBeenCalled();
    });
    it('should navigate to plan entry when action is \'EDIT\'', () => {
      const spy = spyOn(TestBed.get(NavigatorService), 'goToPlanEntry').and.stub();
      component.onCategorySelect({action: PlanLandingAction.EDIT, category: {categoryId: 1}});
      expect(spy).toHaveBeenCalled();
    });
    it('should navigate to plan entry when action is \'START\'', () => {
      const spy = spyOn(TestBed.get(NavigatorService), 'goToPlanEntry').and.stub();
      component.onCategorySelect({action: PlanLandingAction.START, category: {categoryId: 1}});
      expect(spy).toHaveBeenCalled();
    });
    it('should navigate to plan entry when action is \'RESUME\'', () => {
      const spy = spyOn(TestBed.get(NavigatorService), 'goToPlanEntry').and.stub();
      component.onCategorySelect({action: PlanLandingAction.RESUME, category: {categoryId: 1}});
      expect(spy).toHaveBeenCalled();
    });
    it('should navigate to plan entry when action is \'VIEW\'', () => {
      const spy = spyOn(TestBed.get(NavigatorService), 'goToPlanEntry').and.stub();
      component.onCategorySelect({action: PlanLandingAction.VIEW, category: {categoryId: 1}});
      expect(spy).toHaveBeenCalled();
    });
  });

});
