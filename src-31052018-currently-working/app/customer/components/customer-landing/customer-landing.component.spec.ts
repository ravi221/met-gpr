import {ActivityCardStubComponent} from '../../../activity/components/activity-card/activity-card.component.stub';
import {async, ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {BreadcrumbsStubComponent} from '../../../navigation/components/breadcrumbs/breadcrumbs.component.stub';
import {CardComponent} from '../../../ui-controls/components/card/card.component';
import {CustomerLandingBannerStubComponent} from './customer-landing-banner/customer-landing-banner.component.stub';
import {CustomerLandingButtonsStubComponent} from 'app/customer/components/customer-landing/customer-landing-buttons/customer-landing-buttons.component.stub';
import {CustomerLandingComponent} from './customer-landing.component';
import {CustomerLandingService} from '../../services/customer-landing.service';
import {FilterBarStubComponent} from '../../../core/components/filter-bar/filter-bar.component.stub';
import {FilterLinkService} from '../../../core/services/filter-link.service';
import {FormsModule} from '@angular/forms';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {IconComponent} from '../../../ui-controls/components/icon/icon.component';
import {ICustomer} from '../../interfaces/iCustomer';
import {IFilterLink} from '../../../core/interfaces/iFilterLink';
import {IPlanResponse} from '../../../plan/interfaces/iPlanReponse';
import {LoadingIconComponent} from '../../../ui-controls/components/loading-icon/loading-icon.component';
import {MockCustomerLandingService} from '../../services/customer-landing.service.mock';
import {MockModalService} from '../../../ui-controls/services/modal.service.mock';
import {MockNavigatorService} from '../../../navigation/services/navigator.service.mock';
import {MockProductDataService} from '../../../core/services/product-data.service.mock';
import {MockUserProfileService} from '../../../core/services/user-profile-service-mock';
import {ModalService} from '../../../ui-controls/services/modal.service';
import {NavigatorService} from '../../../navigation/services/navigator.service';
import {NotificationService} from '../../../core/services/notification.service';
import {NotificationTypes} from '../../../core/models/notification-types';
import {Observable} from 'rxjs/Observable';
import {PagingService} from '../../../ui-controls/services/paging.service';
import {PlanAction} from '../../../plan/enums/plan-action';
import {PlanDataService} from '../../../plan/plan-shared/services/plan-data.service';
import {PlanFilterContextTypes} from '../../../plan/enums/plan-filter-context';
import {PlanFilterStubComponent} from '../../../plan/components/plan-filter/plan-filter.component.stub';
import {PlanListStubComponent} from '../../../plan/components/plan-list/plan-list.component.stub';
import {PlanStatus} from '../../../plan/enums/plan-status';
import {ProductDataService} from '../../../core/services/product-data.service';
import {QuickLinksStubComponent} from '../../../core/components/quick-links/quick-links.component.stub';
import {RouterTestingModule} from '@angular/router/testing';
import {UserProfileService} from '../../../core/services/user-profile.service';
import { FlagCardStubComponent } from 'app/flag/components/flag-card/flag-card.component.stub';
import {SortOptionsService} from '../../../core/services/sort-options.service';

describe('CustomerLandingComponent', () => {
  let component: CustomerLandingComponent;
  let fixture: ComponentFixture<CustomerLandingComponent>;
  let mockPlanResponse = <IPlanResponse>{
    plans: [{
      planId: '1',
      planName: 'Test Plan Name',
      effectiveDate: '01/01/2017',
      lastUpdatedTimestamp: '01/01/2017',
      flagsCount: 1,
      status: PlanStatus.IN_REVISION,
      completionPercentage: 10,
      errorCount: 0
    }],
    page: 1,
    pageSize: 10,
    totalCount: 1
  };

  class MockPlanDataService {
    searchPlans() {
      return Observable.of(mockPlanResponse);
    }
  }


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, RouterTestingModule, HttpClientTestingModule],
      declarations: [
        ActivityCardStubComponent,
        BreadcrumbsStubComponent,
        CardComponent,
        CustomerLandingBannerStubComponent,
        CustomerLandingButtonsStubComponent,
        CustomerLandingComponent,
        FilterBarStubComponent,
        FlagCardStubComponent,
        IconComponent,
        LoadingIconComponent,
        PlanFilterStubComponent,
        PlanListStubComponent,
        QuickLinksStubComponent,
      ],
      providers: [
        FilterLinkService,
        NotificationService,
        PagingService,
        SortOptionsService,
        {provide: NavigatorService, useClass: MockNavigatorService},
        {provide: ModalService, useClass: MockModalService},
        {provide: CustomerLandingService, useClass: MockCustomerLandingService},
        {provide: PlanDataService, useClass: MockPlanDataService},
        {provide: ProductDataService, useClass: MockProductDataService},
        {provide: UserProfileService, useClass: MockUserProfileService}
      ]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(CustomerLandingComponent);
        component = fixture.componentInstance;
        component.customer = <ICustomer>{customerName: 'Test Customer', customerNumber: 1111111};
        component.filterLinks = [
          <IFilterLink>{label: 'Test Filter Link', filter: {}, active: true, subLinks: []},
          <IFilterLink>{label: 'Test Filter Link 2', filter: {}, active: true, subLinks: []}
        ];
        fixture.detectChanges();
      });
  }));

  afterEach(() => {
    if (fixture) {
      fixture.destroy();
    }
  });

  it('should open modal for add plan', () => {
    let customerLandingService = TestBed.get(CustomerLandingService);
    const spy = spyOn(customerLandingService, 'openAddPlanModal').and.callThrough();
    component.handleAddPlan();
    expect(spy).toHaveBeenCalled();
  });

  describe('Scrolling', () => {
    it('should display the loading icon when scrolling to load more plans', () => {
      component.isLoadingPaginatedPlans = false;

      component['_currentSearchPlanCount'] = 200;
      component['_planRequest']['page'] = 1;
      component['_planRequest']['pageSize'] = 10;
      component.onScrollAtBottom();

      expect(component.isLoadingPaginatedPlans).toBeTruthy();
    });
  });

  describe('Getting plans', () => {
    let planDataService: PlanDataService;
    let spy: jasmine.Spy;

    beforeEach(() => {
      planDataService = TestBed.get(PlanDataService);
      spy = spyOn(planDataService, 'searchPlans').and.callThrough();
    });

    it('should search plans when the sort changes', fakeAsync(() => {
      component.handleSortChange({sortAsc: true, sortBy: 'planName', label: 'Test', active: true});
      tick(1000);
      expect(spy).toHaveBeenCalled();
    }));

    it('should search plans when the filter link changes', fakeAsync(() => {
      component.handleFilterLinkChange([]);
      tick(1000);
      expect(spy).toHaveBeenCalled();
    }));

    it('should search plans when copying a plan to the same customer', fakeAsync(() => {
      component.onPlanAction({
        planAction: PlanAction.COPY,
        data: {
          isDifferentCustomer: false
        }
      });
      tick(1000);
      expect(spy).toHaveBeenCalled();
    }));

    it('should search plans when copying a plan to a new customer but the data is null', fakeAsync(() => {
      component.onPlanAction({
        planAction: PlanAction.COPY,
        data: null
      });
      tick(1000);
      expect(spy).toHaveBeenCalled();
    }));

    it('should search plans when performing a plan action and errors are null', fakeAsync(() => {
      component.onPlanAction({
        planAction: PlanAction.CANCEL,
        error: null,
        data: {
          message: 'Success'
        }
      });
      tick(1000);
      expect(spy).toHaveBeenCalled();
    }));

    it('should search plans when performing a plan action and errors are undefined', fakeAsync(() => {
      component.onPlanAction({
        planAction: PlanAction.CANCEL,
        error: undefined,
        data: {
          message: 'Success'
        }
      });
      tick(1000);
      expect(spy).toHaveBeenCalled();
    }));

    it('should search plans when performing a plan action and there are errors', fakeAsync(() => {
      component.onPlanAction({
        planAction: PlanAction.CANCEL,
        error: {
          test: 'a'
        },
        data: {
          message: 'Success'
        }
      });
      tick(1000);
      expect(spy).not.toHaveBeenCalled();
    }));

    it('should search plans when copying a plan to a new customer but the data is undefined', fakeAsync(() => {
      component.onPlanAction({
        planAction: PlanAction.COPY,
        data: undefined
      });
      tick(1000);
      expect(spy).toHaveBeenCalled();
    }));

    it('should search plans when the filter changes', fakeAsync(() => {
      component.handleFilterMenuChange({
        context: PlanFilterContextTypes.CUSTOMER_HOME_PAGE,
        planName: 'a',
        planIds: ['1']
      });
      tick(1000);
      expect(spy).toHaveBeenCalled();
    }));

    it('should not search plans when the filter plan name and plan ids are nil', fakeAsync(() => {
      component.handleFilterMenuChange({
          context: PlanFilterContextTypes.CUSTOMER_HOME_PAGE,
          planName: null,
          planIds: null
        }
      );
      tick(1000);
      expect(spy).not.toHaveBeenCalled();

      component.handleFilterMenuChange({
          context: PlanFilterContextTypes.CUSTOMER_HOME_PAGE,
          planName: undefined,
          planIds: undefined
        }
      );
      tick(1000);
      expect(spy).not.toHaveBeenCalled();
    }));

    it('should not search plans when the filter is null', fakeAsync(() => {
      component.handleFilterMenuChange(null);
      tick(1000);
      expect(spy).not.toHaveBeenCalled();
    }));

    it('should not search plans when the filter is undefined', fakeAsync(() => {
      component.handleFilterMenuChange(undefined);
      tick(1000);
      expect(spy).not.toHaveBeenCalled();
    }));

    it('should not search plans when the filter is not for the Customer Home Page', fakeAsync(() => {
      component.handleFilterMenuChange({context: PlanFilterContextTypes.MAIN_MENU});
      tick(1000);
      expect(spy).not.toHaveBeenCalled();
    }));
  });

  describe('Getting products', () => {
    let productDataService: ProductDataService;
    let spy: jasmine.Spy;

    beforeEach(() => {
      productDataService = TestBed.get(ProductDataService);
      spy = spyOn(productDataService, 'getProductsForCustomer').and.returnValue(Observable.of([]));
    });

    it('should not call to get products when performing an invalid plan action', () => {
      component.onPlanAction(null);
      expect(spy).not.toHaveBeenCalled();

      component.onPlanAction(undefined);
      expect(spy).not.toHaveBeenCalled();
    });

    it('should call to get products when performing a plan action', () => {
      component.onPlanAction({
        planAction: PlanAction.COPY,
        data: null
      });
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('Navigation', () => {
    let navigator: NavigatorService;

    beforeEach(() => {
      navigator = TestBed.get(NavigatorService);
    });

    it('should navigate to a plan when a plan is clicked', () => {
      const planId = '1';
      const spy = spyOn(navigator, 'goToPlanHome').and.stub();
      component.goToPlan(planId);
      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledWith(planId);
    });

    it('should navigate to Mass update when mass update button is clicked', () => {
      const spy = spyOn(navigator, 'goToMassUpdateHome').and.stub();
      component.goToMassUpdate();
      expect(spy).toHaveBeenCalled();
    });

    it('should navigate to Customer Info when customer info button is clicked', () => {
      const spy = spyOn(navigator, 'goToCustomerInfoHome').and.stub();
      component.goToCustomerInfo();
      expect(spy).toHaveBeenCalled();
    });

    it('should not navigate to Customer home on plan action when plan action is null', () => {
      const spy = spyOn(navigator, 'goToCustomerHome').and.stub();
      component.onPlanAction(null);
      expect(spy).not.toHaveBeenCalled();
    });

    it('should not navigate to Customer home on plan action when plan action is null', () => {
      const spy = spyOn(navigator, 'goToCustomerHome').and.stub();
      component.onPlanAction(undefined);
      expect(spy).not.toHaveBeenCalled();
    });

    it('should navigate to Customer home when copying a plan to a different customer', () => {
      const spy = spyOn(navigator, 'goToCustomerHome').and.stub();
      component.onPlanAction({
        planAction: PlanAction.COPY,
        data: {
          isDifferentCustomer: true,
          customerNumber: 1
        }
      });
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('Notifications', () => {
    let notificationService: NotificationService;
    let spy: jasmine.Spy;

    beforeEach(() => {
      notificationService = TestBed.get(NotificationService);
      spy = spyOn(notificationService, 'addNotification').and.stub();
    });

    it('should add a success notification when successfully cancelling a plan', () => {
      const message = 'Successfully cancelled plan';
      component.onPlanAction({
        planAction: PlanAction.CANCEL,
        data: {
          message
        }
      });
      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledWith(NotificationTypes.SUCCESS, message);
    });

    it('should add an error notification when errors occur when cancelling a plan', () => {
      const error = 'Error cancelling plan';
      component.onPlanAction({
        planAction: PlanAction.CANCEL,
        error
      });
      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledWith(NotificationTypes.ERROR, error);
    });
  });
});
