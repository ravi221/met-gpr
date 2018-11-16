import {async, ComponentFixture, discardPeriodicTasks, fakeAsync, TestBed} from '@angular/core/testing';

import {MainNavMenuComponent} from './main-nav-menu.component';
import {RouterTestingModule} from '@angular/router/testing';
import {NavigationModule} from '../navigation.module';
import {CustomerDataService} from '../../customer/services/customer-data.service';
import {UserProfileService} from '../../core/services/user-profile.service';
import {MockUserProfileService} from 'app/core/services/user-profile-service-mock';
import {SearchSortService} from 'app/search/services/search-sort.service';
import {NavContextType} from '../enums/nav-context';
import {ICustomer} from 'app/customer/interfaces/iCustomer';
import {By} from '@angular/platform-browser';
import {CustomerSearchService} from '../../search/services/customer-search.service';
import {DateService} from '../../core/services/date.service';
import {Subscription} from 'rxjs/Subscription';

describe('MainNavMenuComponent', () => {
  let component: MainNavMenuComponent;
  let fixture: ComponentFixture<MainNavMenuComponent>;
  let subscription: Subscription;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        NavigationModule,
        RouterTestingModule
      ],
      providers: [
        CustomerDataService,
        {provide: UserProfileService, useClass: MockUserProfileService},
        SearchSortService,
        CustomerSearchService,
        DateService
      ]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(MainNavMenuComponent);
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

  it('should emit when closeNavMenu is called', () => {
    let spy = spyOn(component.close, 'emit');
    component.closeNavMenu();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalled();
    spy = null;
  });

  it('should set context to default and customer to null when goToDefaultContext is called', () => {
    component.goToDefaultContext();
    expect(component.customer).toBeNull();
    expect(component.context).toBe(NavContextType.DEFAULT);
    let closeButton = fixture.debugElement.query(By.css('.main-menu-close'));
    expect(closeButton).toBeNull();
    let backButton = fixture.debugElement.query(By.css('.main-menu-back'));
    expect(backButton).toBeDefined();
  });

  it('should set context to customer and customer to passed customer when goToCustomerContext is called', () => {
    const customer = <ICustomer>{
      customerName: 'Cust Name',
      customerNumber: 1234
    };
    component.goToCustomerContext(customer);
    expect(component.customer).toBe(customer);
    expect(component.context).toBe(NavContextType.CUSTOMER);
    let closeButton = fixture.debugElement.query(By.css('.main-menu-close'));
    expect(closeButton).toBeDefined();
    let backButton = fixture.debugElement.query(By.css('.main-menu-back'));
    expect(backButton).toBeNull();
  });
});
