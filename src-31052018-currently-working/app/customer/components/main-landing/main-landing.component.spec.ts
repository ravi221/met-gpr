import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {CustomerDataService} from 'app/customer/services/customer-data.service';
import {CustomerListStubComponent} from '../customer-list/customer-list.component.stub';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {LoadingIconComponent} from '../../../ui-controls/components/loading-icon/loading-icon.component';
import {MainLandingComponent} from './main-landing.component';
import {MockCustomerDataService} from '../../services/customer-data.service.mock';
import {mockCustomer} from '../../../../assets/test/common-objects/customer.mock';
import {MockNavigatorService} from '../../../navigation/services/navigator.service.mock';
import {MockUserProfileService} from '../../../core/services/user-profile-service-mock';
import {NavigatorService} from '../../../navigation/services/navigator.service';
import {RouterTestingModule} from '@angular/router/testing';
import {ScrollDirective} from '../../../ui-controls/directives/scroll.directive';
import {ScrollService} from '../../../ui-controls/services/scroll.service';
import {SortByOption} from '../../../core/enums/sort-by-option';
import {UserProfileService} from '../../../core/services/user-profile.service';
import {UserProfile} from 'app/core/models/user-profile';
import {ToggleStubComponent} from '../../../ui-controls/components/toggle/toggle.component.stub';

describe('MainLandingComponent', () => {
  let component: MainLandingComponent;
  let fixture: ComponentFixture<MainLandingComponent>;
  let userProfileService: MockUserProfileService;
  let customerDataService: CustomerDataService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule],
      declarations: [
        CustomerListStubComponent,
        LoadingIconComponent,
        MainLandingComponent,
        ScrollDirective,
        ToggleStubComponent
      ],
      providers: [
        ScrollService,
        {provide: CustomerDataService, useClass: MockCustomerDataService},
        {provide: NavigatorService, useClass: MockNavigatorService},
        {provide: UserProfileService, useClass: MockUserProfileService}
      ]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(MainLandingComponent);
        component = fixture.componentInstance;
        component.customers = [mockCustomer];
        component.currentUser = new UserProfile({userId: '1'});
        fixture.detectChanges();

        userProfileService = TestBed.get(UserProfileService);
        customerDataService = TestBed.get(CustomerDataService);
      });
  }));

  afterEach(() => {
    if (fixture) {
      fixture.destroy();
    }
  });

  describe('Hiding customers', () => {

    it('should hide the given customer and decrement the customers by one', () => {
      expect(component.customers.length).toBe(1);

      const customerToHide = component.customers[0];
      component.onSetHiddenCustomer(customerToHide);
      expect(component.customers.length).toBe(0);
    });

    it('should call to update the visibility for a given customer', () => {
      const spy = spyOn(userProfileService, 'updateCustomerVisibility').and.callThrough();
      const customerToHide = component.customers[0];
      component.onSetHiddenCustomer(customerToHide);
      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledWith(customerToHide);
    });
  });

  describe('Changing sort', () => {
    it('should call to save sort once the sort changes', () => {
      const spy = spyOn(userProfileService, 'saveUserPreference').and.callThrough();
      component.onSortChange({sortBy: SortByOption.CUSTOMER_NAME, sortAsc: false, label: 'T', active: true});
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('Getting customers', () => {
    let spy: jasmine.Spy;

    beforeEach(() => {
      spy = spyOn(customerDataService, 'getCustomers').and.callThrough();
    });

    it('should call to get customers once the sort changes', () => {
      component.onSortChange({sortBy: SortByOption.CUSTOMER_NAME, sortAsc: false, label: 'T', active: true});
      expect(spy).toHaveBeenCalled();
    });

    it('should call to get customers once the toggle to show hidden customers changes', () => {
      component.toggleHiddenCustomers(true);
      expect(spy).toHaveBeenCalled();
    });

    it('should not call to get customers when scrolling when total customers is zero ', () => {
      component['_totalCustomerCount'] = 0;
      component.onScrollAtBottom();
      expect(spy).not.toHaveBeenCalled();
    });

    it('should not call to get customers when scrolling without any more customers to load', () => {
      component['_totalCustomerCount'] = 11;
      component['_customerRequest']['page'] = 1;
      component['_customerRequest']['pageSize'] = 20;
      component.onScrollAtBottom();
      expect(spy).not.toHaveBeenCalled();
    });

    it('should call to get customers when scrolling with more customers to load', () => {
      component['_totalCustomerCount'] = 400;
      component['_customerRequest']['page'] = 1;
      component['_customerRequest']['pageSize'] = 20;
      component.onScrollAtBottom();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('Navigation', () => {
    let navigator: NavigatorService;

    beforeEach(() => {
      navigator = TestBed.get(NavigatorService);
    });

    it('should navigate to a customer when selected', () => {
      const customerNumber = 10;
      const spy = spyOn(navigator, 'goToCustomerHome').and.stub();
      component.onCustomerSelect(customerNumber);
      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledWith(customerNumber);
    });

    it('should navigate to a plan when selected', () => {
      const planHomeObj = {planId: '1', customerNumber: 10};
      const spy = spyOn(navigator, 'goToCustomerPlanHome').and.stub();
      component.onPlanSelect(planHomeObj);
      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledWith(planHomeObj.planId, planHomeObj.customerNumber);
    });
  });
});
