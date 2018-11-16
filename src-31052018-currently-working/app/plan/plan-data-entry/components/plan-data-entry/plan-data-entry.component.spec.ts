import {ComponentFixture, TestBed} from '@angular/core/testing';
import {PlanDataEntryComponent} from './plan-data-entry.component';
import {NavigatorService} from '../../../../navigation/services/navigator.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ViewConfigDataService} from '../../../plan-shared/services/view-config-data.service';
import {LogService} from '../../../../core/services/log.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {PagingService} from '../../../../ui-controls/services/paging.service';
import FormConfig from '../../../../dynamic-form/config/form-config';
import * as configuration from '../../../../../assets/test/dynamic-form/form-config.mock.json';
import * as data from '../../../../../assets/test/dynamic-form/data-manager.mock.json';
import {NotificationService} from '../../../../core/services/notification.service';
import {Subscription} from 'rxjs/Subscription';
import {PlanDataEntryServiceMock} from '../../services/plan-data-entry.service.mock';
import {PlanDataEntryService} from '../../services/plan-data-entry.service';
import {MockRouter, MockNavigatorService} from '../../../../navigation/services/navigator.service.mock';
import {PagingServiceStub} from '../../../../ui-controls/services/paging.service.stub';
import {BreadcrumbsStubComponent} from '../../../../navigation/components/breadcrumbs/breadcrumbs.component.stub';
import {DynamicSectionsListStubComponent} from '../../../../dynamic-form/components/dynamic-sections-list/dynamic-sections-list.component.stub';
import {CardStubComponent} from '../../../../ui-controls/components/card/card.component.stub';
import {DynamicFormStubComponent} from '../../../../dynamic-form/components/dynamic-form/dynamic-form.component.stub';
import {AutoSaveStubComponent} from '../auto-save/auto-save.component.stub';
import {ValidatePlanStubComponent} from '../../../plan-shared/components/validate-plan/validate-plan.component.stub';
import {ScrollService} from 'app/ui-controls/services/scroll.service';
import {PlanEntryNavigationButtonComponent} from 'app/plan/plan-shared/components/plan-entry-navigation-button/plan-entry-navigation-button.component';
import {ModalService} from '../../../../ui-controls/services/modal.service';
import {NgModule} from '@angular/core';
import {ModalContainerComponent} from '../../../../ui-controls/components/modal/modal-container/modal-container.component';
import {CommonModule} from '@angular/common';
import {IconComponent} from '../../../../ui-controls/components/icon/icon.component';
import {ModalBackdropComponent} from '../../../../ui-controls/components/modal/modal-backdrop/modal-backdrop.component';
import {LoadingSpinnerService} from '../../../../ui-controls/services/loading-spinner.service';
import {INavState} from '../../../../navigation/interfaces/iNavState';
import {getNavStateForDataManager} from '../../../../../assets/test/NavStateHelper';
import { FlagCardStubComponent } from 'app/flag/components/flag-card/flag-card.component.stub';


describe('PlanDataEntryComponent', () => {
  let component: PlanDataEntryComponent;
  let fixture: ComponentFixture<PlanDataEntryComponent>;
  let routeStub;
  let subscription: Subscription;
  let navState: INavState = getNavStateForDataManager(data);
  let navigatorService: NavigatorService;
  let navServiceSpy: jasmine.Spy;
  const mockRouter = new MockRouter();
  beforeEach(() => {
    routeStub = {
      data: {
        customer: {
          customerNumber: 1
        },

        plan: {
          status: 'IN-PROGRESS'
        },
        planCategoryData: {
          categoryId: 'mockCategory'
        },
        currentUser: null
      }
    };
    fixture = TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, TestModule],
      declarations: [
        PlanDataEntryComponent,
        BreadcrumbsStubComponent,
        DynamicSectionsListStubComponent,
        FlagCardStubComponent, CardStubComponent,
        DynamicFormStubComponent,
        AutoSaveStubComponent,
        ValidatePlanStubComponent,
        PlanEntryNavigationButtonComponent
      ],
      providers: [
        LogService,
        ViewConfigDataService,
        NotificationService,
        ModalService,
        LoadingSpinnerService,
        {provide: PlanDataEntryService, useClass: PlanDataEntryServiceMock},
        {provide: PagingService, useValue: PagingServiceStub},
        {provide: NavigatorService, useClass: MockNavigatorService},
        {provide: Router, useValue: mockRouter},
        {provide: ActivatedRoute, useValue: routeStub},
        ScrollService]
    }).createComponent(PlanDataEntryComponent);
    component = fixture.componentInstance;
    component.config = new FormConfig(configuration);
    component.config.activateCategoryById('mockCategory');
    component.config.activateSectionById('mockSection');
    navigatorService = TestBed.get(NavigatorService);
    navServiceSpy = spyOn(navigatorService, 'getNavigationState').and.callFake(() => <INavState>{data: {customer: { customerNumber: 1118090}, planCategoryData: {categoryId: 'scheduleofBenefits',
    planId: '239691525202815671'}}});
    component.model = component.config.initializeModel(navState);
    component.customer = routeStub.data.customer;
    component.plan = routeStub.data.plan;
    fixture.detectChanges();
  });

  afterEach(() => {
    if (subscription) {
      subscription.unsubscribe();
      subscription = null;
    }
    if (fixture) {
      fixture.destroy();
    }
  });

  it('should display the correct category name', () => {
    component.categoryName = 'test';
    fixture.detectChanges();
    const categoryName = fixture.nativeElement.querySelector('h4');
    expect(categoryName.textContent).toBe(component.categoryName);
  });

  it('should call the autosave component\'s openModalFunction', () => {
    component.saveComponent = new AutoSaveStubComponent(null, null, null);
    const spy = spyOn(component.saveComponent, 'openSaveModal').and.stub();
    component.canDeactivate();
    expect(spy).toHaveBeenCalled();
  });

  @NgModule({
    imports: [CommonModule],
    exports: [ModalContainerComponent, ModalBackdropComponent],
    declarations: [ModalContainerComponent, ModalBackdropComponent, IconComponent],
    entryComponents: [ModalContainerComponent, ModalBackdropComponent],
  })
  class TestModule {}
});
