import * as mockPlans from 'assets/test/plans/plans.mock.json';
import {async, ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {AuthorizationService} from 'app/core/services/authorization.service';
import {CustomerSearchService} from '../../../search/services/customer-search.service';
import {CustomerStructureDataService} from '../../../customer/services/customer-structure-data.service';
import {DateService} from '../../../core/services/date.service';
import {ICustomerStructure} from '../../../customer/interfaces/iCustomerStructure';
import {ICustomer} from '../../../customer/interfaces/iCustomer';
import {INavState} from 'app/navigation/interfaces/iNavState';
import {IScrollEvent} from 'app/ui-controls/interfaces/iScrollEvent';
import {ISortOption} from '../../../core/interfaces/iSortOption';
import {MockUserProfileService} from '../../../core/services/user-profile-service-mock';
import {NavigationModule} from '../../navigation.module';
import {NavigatorService} from 'app/navigation/services/navigator.service';
import {Observable} from 'rxjs/Observable';
import {PagingService} from 'app/ui-controls/services/paging.service';
import {PlanDataService} from '../../../plan/plan-shared/services/plan-data.service';
import {PlanFilterContextTypes} from '../../../plan/enums/plan-filter-context';
import {PlanFilterService} from 'app/plan/services/plan-filter.service';
import {PlansNavMenuComponent} from './plans-nav-menu.component';
import {RouterTestingModule} from '@angular/router/testing';
import {ScrollEventOrigin} from 'app/ui-controls/enums/scroll-event-origin';
import {ScrollService} from 'app/ui-controls/services/scroll.service';
import {UserProfileService} from 'app/core/services/user-profile.service';

describe('PlansNavMenuComponent', () => {
  let component: PlansNavMenuComponent;
  let fixture: ComponentFixture<PlansNavMenuComponent>;
  let navigatorService: NavigatorService;
  let navServiceSpy: jasmine.Spy;
  let planDataService: NavigatorService;
  let planDataServiceSpy: jasmine.Spy;

  let testPlan = {
    'planName': 'DentalPlan_P73',
    'planId': '689971516878052651',
    'coverageId': '201000',
    'effectiveDate': '10/05/2017',
    'creationTimestamp': '2018-01-25T06:00:52',
    'lastUpdatedTimestamp': '2018-01-29T12:49:37',
    'completionPercentage': 0,
    'ppcModelName': null,
    'ppcModelVersion': null,
    'categories': [
      {
        'categoryId': 'planInfo',
        'categoryName': 'Plan Info',
        'validationIndicator': 'NOT VALIDATED',
        'statusCode': 'IN-PROGRESS',
        'completionPercentage': 0,
        'sections': [
          {
            'sectionId': 'planDetails',
            'sectionName': 'Plan Details',
            'totalFieldCount': 0,
            'completedFieldCount': 0,
            'completionPercentage': 0,
            'validationIndicator': 'NOT VALIDATED'
          }
        ]
      }
    ]
  };

  const structure: ICustomerStructure = {
    value: '1',
    name: 'The name',
    planIds: ['1']
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NavigationModule, RouterTestingModule],
      providers: [
        PlanDataService,
        PlanFilterService,
        NavigatorService,
        PagingService,
        AuthorizationService,
        CustomerSearchService,
        DateService,
        CustomerStructureDataService,
        {provide: UserProfileService, useClass: MockUserProfileService},
      ]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(PlansNavMenuComponent);
        component = fixture.componentInstance;
        navigatorService = TestBed.get(NavigatorService);
        navServiceSpy = spyOn(navigatorService, 'getNavigationState').and.callFake(() => <INavState>{data: {customer: null}});
        planDataService = TestBed.get(PlanDataService);
        planDataServiceSpy = spyOn(planDataService, 'searchPlans').and.callFake(() => {
          return Observable.of(mockPlans);
        });
        spyOn(planDataService, 'getPlanById').and.callFake(() => {
          return Observable.of(testPlan);
        });
        spyOn(TestBed.get(PagingService), 'getNextPageNumber').and.returnValue(1);
        spyOn(TestBed.get(CustomerStructureDataService), 'getStructure').and.returnValue(Observable.of([structure]));
      });
  }));

  afterEach(() => {
   if (fixture) {
     fixture.destroy();
   }
  });

  it('should create', () => {
    component.customer = <ICustomer>{customerNumber: 123456};
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('Testing Scroll', () => {
    let scrollService: ScrollService;
    let scrollServiceSpy: jasmine.Spy;
    beforeEach(() => {
      component.customer = <ICustomer>{customerNumber: 123456};
      scrollService = TestBed.get(ScrollService);
      scrollServiceSpy = spyOn(component, 'onScrollEventHandler');
      fixture.detectChanges();
    });

    it('should not call onScrollEventHandler when eventOrigin is not MAIN_NAV_MENU', fakeAsync(() => {
      const scrollEvent = <IScrollEvent>{
        eventElement: {},
        eventOrigin: ScrollEventOrigin.NOT_SET,
        isNearBottom: false,
        bottomThreshold: 20
      };
      scrollService.sendScrollEvent(scrollEvent);
      tick(100);
      expect(scrollServiceSpy).toHaveBeenCalledTimes(0);
    }));
    it('should call onScrollEventHandler when eventOrigin is MAIN_NAV_MENU', fakeAsync(() => {
      const scrollEvent = <IScrollEvent>{
        eventElement: {},
        eventOrigin: ScrollEventOrigin.MAIN_NAV_MENU,
        isNearBottom: false,
        bottomThreshold: 20
      };
      scrollService.sendScrollEvent(scrollEvent);
      tick(100);
      expect(scrollServiceSpy).toHaveBeenCalledTimes(1);
    }));
  });
  describe('Testing applySort', () => {
    it('should call searchPlans 2 times', fakeAsync(() => {
      const sort = <ISortOption>{
        sortAsc: true,
        sortBy: 'planName'
      };
      component.customer = <ICustomer>{customerNumber: 123456};
      fixture.detectChanges();
      component.applySort(sort);
      tick(100);
      expect(planDataServiceSpy).toHaveBeenCalledTimes(2);
    }));
  });
  describe('Testing handleFilterMenuChange', () => {
    beforeEach(() => {
      component.customer = <ICustomer>{customerNumber: 123456};
      fixture.detectChanges();
    });
    it('should call searchPlans 1 when null filter', fakeAsync(() => {
      component.handleFilterMenuChange(null);
      tick(100);
      expect(planDataServiceSpy).toHaveBeenCalledTimes(1);
    }));
    it('should call searchPlans 1 when incorrect filter context', fakeAsync(() => {
      component.handleFilterMenuChange({context: PlanFilterContextTypes.CUSTOMER_HOME_PAGE});
      tick(100);
      expect(planDataServiceSpy).toHaveBeenCalledTimes(1);
    }));
    it('should call searchPlans 2 when correct filter context', fakeAsync(() => {
      component.handleFilterMenuChange({context: PlanFilterContextTypes.MAIN_MENU});
      tick(100);
      expect(planDataServiceSpy).toHaveBeenCalledTimes(2);
    }));
  });
});
