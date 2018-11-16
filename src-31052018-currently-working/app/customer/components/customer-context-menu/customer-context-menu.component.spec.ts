import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {AuthorizationService} from 'app/core/services/authorization.service';
import {By} from '@angular/platform-browser';
import {click} from '../../../../assets/test/TestHelper';
import {CustomerContextMenuComponent} from './customer-context-menu.component';
import {CustomerDataService} from 'app/customer/services/customer-data.service';
import {CustomerSearchService} from '../../../search/services/customer-search.service';
import {DateService} from '../../../core/services/date.service';
import {DebugElement} from '@angular/core';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {IconComponent} from '../../../ui-controls/components/icon/icon.component';
import {Idle, IdleExpiry} from '@ng-idle/core';
import {LogoutService} from '../../../navigation/services/logout.service';
import {MockIdleExpiry} from 'app/core/services/idle-expiry.mock';
import {PagingService} from '../../../ui-controls/services/paging.service';
import {ScrollService} from '../../../ui-controls/services/scroll.service';
import {SortOptionsService} from '../../../core/services/sort-options.service';
import {TooltipContentComponent} from '../../../ui-controls/components/tooltip/tooltip-content.component';
import {TooltipDirective} from '../../../ui-controls/components/tooltip/tooltip.directive';
import {TooltipPositionService} from '../../../ui-controls/services/tooltip-position.service';
import {TooltipService} from '../../../ui-controls/services/tooltip.service';
import {UserPreferencesService} from '../../../core/services/user-preferences.service';
import {UserProfileService} from '../../../core/services/user-profile.service';
import {mockCustomer} from '../../../../assets/test/common-objects/customer.mock';

describe('CustomerContextMenuComponent', () => {
  let component: CustomerContextMenuComponent;
  let fixture: ComponentFixture<CustomerContextMenuComponent>;
  let tooltip: DebugElement;
  let contextIcon: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [CustomerContextMenuComponent, IconComponent, TooltipDirective, TooltipContentComponent],
      providers: [
        AuthorizationService,
        CustomerDataService,
        CustomerSearchService,
        DateService,
        Idle,
        LogoutService,
        PagingService,
        ScrollService,
        SortOptionsService,
        TooltipPositionService,
        TooltipService,
        UserPreferencesService,
        UserProfileService,
        {provide: IdleExpiry, useClass: MockIdleExpiry},
      ]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(CustomerContextMenuComponent);
        component = fixture.componentInstance;
        component.customer = mockCustomer;
        fixture.detectChanges();
        tooltip = fixture.debugElement.query(By.css('.tooltip-options-list a'));
        contextIcon = fixture.debugElement.query(By.css('.customer-context-menu-icon'));
      });
  }));

  afterEach(() => {
    if (fixture) {
      fixture.destroy();
    }
  });

  describe('Tooltip context menu', () => {
    it('should initialize correctly', () => {
      const tooltips = fixture.debugElement.queryAll(By.css('.tooltip-options-list a'));
      expect(tooltips.length).toEqual(1);
      expect(tooltips[0].nativeElement.textContent.trim()).toContain('Hide');
    });
  });

  describe('Tooltip events and functionality', () => {
    it('should toggle customer visibility property', () => {
      let expectedVisibility = !component.customer.hiddenStatus;
      click(tooltip, fixture);

      fixture.detectChanges();
      expect(component.customer.hiddenStatus).toEqual(expectedVisibility);
    });

    it('should trigger click event with correct parameters to changeCustomerVisibility function', () => {
      let spy = spyOn(component, 'changeCustomerVisibility');
      component.homeActions = [
        {
          label: this.toggleButtonState === 'on' ? 'Show' : 'Hide',
          action: component.changeCustomerVisibility.bind(component)
        }
      ];
      fixture.detectChanges();

      click(fixture.debugElement.query(By.css('.tooltip-options-list a')), fixture);
      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledWith();
    });

    it('should emit onSetHiddenCustomer event', (done) => {
      const subscription = component.customerHide.subscribe(customer => {
        expect(customer).toBe(component.customer);
        subscription.unsubscribe();
        done();
      });
      component.changeCustomerVisibility();
    });
  });
});
