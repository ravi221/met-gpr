import {async, ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {CustomerDataService} from '../../../customer/services/customer-data.service';
import {CustomerNavRowStubComponent} from './customer-nav-row/customer-nav-row.component.stub';
import {CustomersNavMenuComponent} from './customers-nav-menu.component';
import {IconComponent} from '../../../ui-controls/components/icon/icon.component';
import {IScrollEvent} from 'app/ui-controls/interfaces/iScrollEvent';
import {ISortOption} from '../../../core/interfaces/iSortOption';
import {LoadingIconComponent} from '../../../ui-controls/components/loading-icon/loading-icon.component';
import {MainNavTemplateComponent} from '../templates/main-nav-template/main-nav-template.component';
import {MainNavTitleComponent} from '../main-nav-title/main-nav-title.component';
import {MockCustomerDataService} from 'app/customer/services/customer-data.service.mock';
import {mockCustomer} from '../../../../assets/test/common-objects/customer.mock';
import {MockUserProfileService} from 'app/core/services/user-profile-service-mock';
import {RouterTestingModule} from '@angular/router/testing';
import {ScrollEventOrigin} from '../../../ui-controls/enums/scroll-event-origin';
import {ScrollService} from 'app/ui-controls/services/scroll.service';
import {SortMenuStubComponent} from '../../../core/components/sort-menu/sort-menu.component.stub';
import {SortOptionsService} from '../../../core/services/sort-options.service';
import {UserProfileService} from 'app/core/services/user-profile.service';

describe('CustomersNavMenuComponent', () => {
  let component: CustomersNavMenuComponent;
  let fixture: ComponentFixture<CustomersNavMenuComponent>;
  let customerDataService: CustomerDataService;
  let customerDataServiceSpy: jasmine.Spy;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [
        CustomerNavRowStubComponent,
        CustomersNavMenuComponent,
        IconComponent,
        LoadingIconComponent,
        MainNavTemplateComponent,
        MainNavTitleComponent,
        SortMenuStubComponent,
      ],
      providers: [
        ScrollService,
        SortOptionsService,
        {provide: CustomerDataService, useClass: MockCustomerDataService},
        {provide: UserProfileService, useClass: MockUserProfileService},
      ]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(CustomersNavMenuComponent);
        component = fixture.componentInstance;
        customerDataService = TestBed.get(CustomerDataService);
        customerDataServiceSpy = spyOn(customerDataService, 'getCustomers').and.callThrough();
        fixture.detectChanges();
      });
  }));

  afterEach(() => {
    if (fixture) {
      fixture.destroy();
    }
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(customerDataServiceSpy).toHaveBeenCalledTimes(1);
  });

  it('should call to get customers on applySort', () => {
    let sort = <ISortOption>{
      label: 'A-Z',
      sortBy: 'customerName',
      sortAsc: true,
      active: true
    };
    component.applySort(sort);
    expect(customerDataServiceSpy).toHaveBeenCalledTimes(2);
  });

  it('should emit when customer is selected', (done) => {
    const sub = component.customerSelect.subscribe((customer) => {
      expect(customer).toBeDefined();
      expect(customer).toBe(mockCustomer);
      done();
    });
    component.selectCustomer(mockCustomer);
  });

  describe('Testing Scroll', () => {
    let scrollService: ScrollService;
    let scrollServiceSpy: jasmine.Spy;

    beforeEach(() => {
      scrollService = TestBed.get(ScrollService);
      scrollServiceSpy = spyOn(component, 'checkToLoadMoreCustomers');
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
        isNearBottom: true,
        bottomThreshold: 20
      };
      spyOn(scrollService, 'isNearBottom').and.returnValue(true);
      scrollService.sendScrollEvent(scrollEvent);
      tick(100);
      expect(scrollServiceSpy).toHaveBeenCalledTimes(1);
    }));
  });
});
