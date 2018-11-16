import {activity1} from '../../../../assets/test/common-objects/activity.mock';
import {ActivityService} from '../../../activity/services/activity.service';
import {ActivityTooltipComponent} from '../../../activity/components/activity-tooltip/activity-tooltip.component';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {CardComponent} from '../../../ui-controls/components/card/card.component';
import {click} from '../../../../assets/test/TestHelper';
import {Component, ViewChild} from '@angular/core';
import {CustomerContextMenuComponent} from '../customer-context-menu/customer-context-menu.component';
import {CustomerListComponent} from './customer-list.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {IconComponent} from '../../../ui-controls/components/icon/icon.component';
import {ICustomer} from '../../interfaces/iCustomer';
import {IUserPreference} from '../../../core/interfaces/iUserPreference';
import {LoadingIconComponent} from '../../../ui-controls/components/loading-icon/loading-icon.component';
import {mockCustomer} from '../../../../assets/test/common-objects/customer.mock';
import {MockNavigatorService} from '../../../navigation/services/navigator.service.mock';
import {NavigatorService} from '../../../navigation/services/navigator.service';
import {PageContextTypes} from '../../../core/enums/page-context-types';
import {RouterTestingModule} from '@angular/router/testing';
import {SortOptionsService} from '../../../core/services/sort-options.service';
import {Subscription} from 'rxjs/Subscription';
import {TooltipContentComponent} from '../../../ui-controls/components/tooltip/tooltip-content.component';
import {TooltipDirective} from '../../../ui-controls/components/tooltip/tooltip.directive';
import {TooltipPositionService} from '../../../ui-controls/services/tooltip-position.service';
import {TooltipService} from '../../../ui-controls/services/tooltip.service';

describe('CustomerListComponent', () => {
  let component: TestCustomerListComponent;
  let fixture: ComponentFixture<TestCustomerListComponent>;
  let subscription: Subscription;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule],
      declarations: [
        TestCustomerListComponent,
        CustomerListComponent,
        IconComponent,
        ActivityTooltipComponent,
        CustomerContextMenuComponent,
        TooltipDirective,
        TooltipContentComponent,
        CardComponent,
        LoadingIconComponent
      ],
      providers: [
        TooltipService,
        TooltipPositionService,
        {provide: NavigatorService, useClass: MockNavigatorService},
        ActivityService,
        SortOptionsService
      ]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(TestCustomerListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
      });
  }));

  afterEach(() => {
    if (subscription) {
      subscription.unsubscribe();
      subscription = null;
    }
    if (fixture) {
      fixture.destroy();
    }
  });

  describe('Navigation', () => {
    it('should navigate to customer home page when customer name is clicked', () => {
      const spy = spyOn(component, 'onCustomerSelect').and.stub();
      const customerName = fixture.debugElement.query(By.css('.customer-name a'));
      click(customerName, fixture);
      expect(spy).toHaveBeenCalled();
    });

    it('should navigate to customer home page when customer number is clicked', () => {
      const spy = spyOn(component, 'onCustomerSelect').and.stub();
      const customerName = fixture.debugElement.query(By.css('.customer-number a'));
      click(customerName, fixture);
      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledWith(1234);
    });

    it('should navigate to customer home page when \'Start\' is clicked', () => {
      let customers = component.customers;
      customers[0].percentageCompleted = 0;
      fixture.detectChanges();
      const spy = spyOn(component, 'onCustomerSelect').and.stub();
      const startLink = fixture.debugElement.query(By.css('.customer-action:first-child'));
      click(startLink, fixture);
      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledWith(1234);
    });

    it('should navigate to plan home page when \'Resume\' is clicked', () => {
      let customers = component.customers;
      customers[0].percentageCompleted = 50;
      fixture.detectChanges();
      const spy = spyOn(component, 'onPlanSelect').and.stub();
      const resumeLink = fixture.debugElement.query(By.css('.customer-action:first-child'));
      click(resumeLink, fixture);
      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledWith({customerNumber: 1234, planId: mockCustomer.lastActivity.planId});
    });

    it('should navigate to plan home page when \'Plan Home\' is clicked', () => {
      let customers = component.customers;
      customers[0].percentageCompleted = 50;
      fixture.detectChanges();
      const spy = spyOn(component, 'onPlanSelect').and.stub();
      const planHomeLink = fixture.debugElement.query(By.css('.customer-action:last-child'));
      click(planHomeLink, fixture);
      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledWith({customerNumber: 1234, planId: mockCustomer.lastActivity.planId});
    });
  });

  describe('Flags', () => {
    it('should display flag count when there is last activity and flag count is greater than 0', () => {
      let customers = component.customers;
      customers[0].lastActivity.totalFlagCount = 2;
      fixture.detectChanges();
      const flags = fixture.debugElement.query(By.css('.customer-flags'));
      expect(flags).toBeTruthy();
    });

    it('should not display flag count when there is not last activity', () => {
      let customers = component.customers;
      customers[0].lastActivity = null;
      fixture.detectChanges();

      const flags = fixture.debugElement.query(By.css('.customer-flags'));
      expect(flags).toBeNull();
    });

    it('should not display flag count when the flag count is 0', () => {
      let customers = component.customers;
      customers[0].lastActivity = activity1;
      customers[0].lastActivity.totalFlagCount = 0;
      fixture.detectChanges();

      const flags = fixture.debugElement.query(By.css('.customer-flags'));
      expect(flags).toBeNull();
    });
  });

  describe('Sort', () => {
    it('should call sort change when sort header is clicked', () => {
      const spy = spyOn(component, 'onSortChange').and.stub();
      const header = fixture.debugElement.query(By.css('.sort-header:first-child'));
      click(header, fixture);
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('Hiding Customers', () => {
    it('should call to update hidden status of customer', () => {
      const spy = spyOn(component, 'onSetHiddenCustomer').and.stub();
      component.customerList.onCustomerHide(null);
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('No customers message', () => {
    it('should display when there are not customers', () => {
      component.customerList.hasCustomers = true;
      fixture.detectChanges();
      const noCustomersMessage = fixture.debugElement.query(By.css('.no-customers-msg'));
      expect(noCustomersMessage.nativeElement.innerText).toContain('No customers are currently present in your display.');
      expect(noCustomersMessage.properties.hidden).toBeTruthy();
    });

    it('should not display when there are customers', () => {
      component.customerList.hasCustomers = false;
      fixture.detectChanges();
      const noCustomersMessage = fixture.debugElement.query(By.css('.no-customers-msg'));
      expect(noCustomersMessage.properties.hidden).toBeFalsy();
    });
  });

  @Component({
    template: `<gpr-customer-list [customers]="customers"
                                  [userPreference]="userPreference"
                                  (customerHide)="onSetHiddenCustomer($event)"
                                  (customerSelect)="onCustomerSelect($event)"
                                  (planSelect)="onPlanSelect($event)"
                                  (sortChange)="onSortChange($event)"></gpr-customer-list>`
  })
  class TestCustomerListComponent {
    @ViewChild(CustomerListComponent) customerList;
    public customers: ICustomer[] = [mockCustomer];
    public userPreference: IUserPreference = {
      sortBy: 'customerName',
      sortAsc: false,
      pageName: PageContextTypes.USER_HOME,
      editDisplayCount: 0
    };

    public onSetHiddenCustomer(e) {
    }

    public onCustomerSelect(e) {
    }

    public onPlanSelect(e) {
    }

    public onSortChange(e) {
    }

    public goToPlanEntry(e) {
    }
  }
});
