import { FlagLandingComponent } from 'app/flag/components/flag-landing/flag-landing.component';
import { ComponentFixture, async, TestBed } from '@angular/core/testing';
import { FlagFilterService } from 'app/flag/services/flag-filter.service';
import { FlagService } from 'app/flag/services/flag.service';
import { IFlagFilter } from 'app/flag/interfaces/iFlagFilter';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { ModalContainerComponent } from 'app/ui-controls/components/modal/modal-container/modal-container.component';
import { ModalBackdropComponent } from 'app/ui-controls/components/modal/modal-backdrop/modal-backdrop.component';
import { FilterBarComponent } from 'app/core/components/filter-bar/filter-bar.component';
import { FlagFilterComponent } from 'app/flag/components/flag-filter/flag-filter.component';
import { FilterMenuComponent } from 'app/core/components/filter-menu/filter-menu.component';
import { IconComponent } from 'app/ui-controls/components/icon/icon.component';
import { LoadingIconComponent } from 'app/ui-controls/components/loading-icon/loading-icon.component';
import { CardComponent } from 'app/ui-controls/components/card/card.component';
import { FlagListComponent } from 'app/flag/components/flag-list/flag-list.component';
import { SortMenuComponent } from 'app/core/components/sort-menu/sort-menu.component';
import { TooltipDirective } from 'app/ui-controls/components/tooltip/tooltip.directive';
import { TooltipContentComponent } from 'app/ui-controls/components/tooltip/tooltip-content.component';
import { FlagResolverTooltipComponent } from 'app/flag/components/flag-resolver-tooltip/flag-resolver-tooltip.component';
import { FlaggedPlanComponent } from 'app/flag/components/flagged-plan/flagged-plan.component';
import { FlagItemComponent } from 'app/flag/components/flag-item/flag-item.component';
import { EmailLinkComponent } from 'app/ui-controls/components/email-link/email-link.component';
import { ExpandCollapseIconComponent } from 'app/ui-controls/components/expand-collapse-icon/expand-collapse-icon.component';
import { ModalService } from 'app/ui-controls/services/modal.service';
import { NavigatorService } from 'app/navigation/services/navigator.service';
import { FilterLinkService } from 'app/core/services/filter-link.service';
import { UserProfileService } from 'app/core/services/user-profile.service';
import { MockUserProfileService } from 'app/core/services/user-profile-service-mock';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { ICustomer } from 'app/customer/interfaces/iCustomer';
import { IFilterLink } from 'app/core/interfaces/iFilterLink';
import { IFlagsRequest } from 'app/flag/interfaces/iFlagsRequest';
import { IFlagsResponse } from 'app/flag/interfaces/iFlagsResponse';
import { Observable } from 'rxjs/Observable';
import { flagResponse, flagResponse1 } from 'assets/test/common-objects/flags.mock';
import { IFlaggedPlan } from 'app/flag/interfaces/iFlaggedPlan';
import { IFlag } from 'app/flag/interfaces/iFlag';
import { customerContext } from 'assets/test/common-objects/navigation-objects';
import { click } from 'assets/test/TestHelper';
import { By } from '@angular/platform-browser';
import { PagingService } from '../../../ui-controls/services/paging.service';
import { ScrollService } from '../../../ui-controls/services/scroll.service';
import { ProductDataService } from '../../../core/services/product-data.service';
import { CustomerDataService } from '../../../customer/services/customer-data.service';
import { CustomerSearchService } from '../../../search/services/customer-search.service';
import { DateService } from '../../../core/services/date.service';
import { FilterService } from '../../../core/services/filter.service';
import { TooltipService } from '../../../ui-controls/services/tooltip.service';
import { TooltipPositionService } from '../../../ui-controls/services/tooltip-position.service';
import { PlanDataService } from 'app/plan/plan-shared/services/plan-data.service';
import { FilterLinksComponent } from '../../../core/components/filter-links/filter-links.component';
import { FilterChipsComponent } from '../../../core/components/filter-chips/filter-chips.component';
import {MockNavigatorService} from '../../../navigation/services/navigator.service.mock';



describe('FlagLandingComponent', () => {
  let component: FlagLandingComponent;
  let fixture: ComponentFixture<FlagLandingComponent>;
  let flagFilterService: FlagFilterService;
  let flagService: MockFlagService;
  let flagFilter: IFlagFilter = {
    planName: '',
    status: false
  };

beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule, FormsModule],
      declarations: [
        ModalContainerComponent,
        FilterLinksComponent,
        FilterChipsComponent,
        ModalBackdropComponent,
        FlagLandingComponent,
        FilterBarComponent,
        FilterMenuComponent,
        FlagFilterComponent,
        IconComponent,
        LoadingIconComponent,
        CardComponent,
        FlagListComponent,
        SortMenuComponent,
        TooltipDirective,
        TooltipContentComponent,
        FlagResolverTooltipComponent,
        FlaggedPlanComponent,
        FlagItemComponent,
        EmailLinkComponent,
        ModalContainerComponent,
        ModalBackdropComponent,
        ExpandCollapseIconComponent
      ],
      providers: [
        ModalService,
        {provide: NavigatorService, useClass: MockNavigatorService},
        PlanDataService,
        FilterLinkService,
        PagingService,
        ScrollService,
        ProductDataService,
        CustomerDataService,
        CustomerSearchService,
        DateService,
        FlagFilterService,
        FilterService,
        TooltipService,
        TooltipPositionService,
        MockFlagService,
        {provide: FlagService, useClass: MockFlagService},
        {provide: UserProfileService, useClass: MockUserProfileService}
      ]
    });
    TestBed.overrideModule(BrowserDynamicTestingModule, {
      set: {
        entryComponents: [ModalContainerComponent, ModalBackdropComponent]
      }
    });
  }));

  beforeEach(() => {
    flagService = TestBed.get(MockFlagService);
    fixture = TestBed.createComponent(FlagLandingComponent);
    component = fixture.componentInstance;
    component.customer = <ICustomer>{customerName: 'Test Customer', customerNumber: 1118090};
    component.filterLinks = [
      <IFilterLink> {label: 'Test Filter Link', filter: {}, active: true, subLinks: []},
      <IFilterLink> {label: 'Test Filter Link 2', filter: {}, active: true, subLinks: []}
    ];
    fixture.detectChanges();
    flagFilterService = TestBed.get(FlagFilterService);
  });

  afterEach(() => {
    if (fixture) {
      fixture.destroy();
    }
  });

  describe('Flag Landing Banner', () => {
    it('should properly show Flags in the banner', () => {
      const flagsBanner = fixture.debugElement.query(By.css('.banner h4 strong'));
      expect(flagsBanner.nativeElement.innerHTML).toBe('Flags');
    });
  });

  describe('Filtering', () => {

    it('should trigger filter menu change event', () => {
      const spy = spyOn(component, 'searchFlags').and.stub();
      component.handleFilterMenuChange(flagFilter);
      expect(spy).toHaveBeenCalled();
    });

    it('should not trigger filter menu change event when there is not a filter', () => {
      const spy = spyOn(component, 'searchFlags').and.stub();
      component.handleFilterMenuChange(null);
      expect(spy).not.toHaveBeenCalled();
    });

    it('should trigger filter link change event', () => {
      const spy = spyOn(component, 'searchFlags').and.stub();
      const link = fixture.debugElement.query(By.css('.filter-bar .filter-links:first-child li:last-child a'));
      click(link);
      component.handleFilterLinkChange([]);
      expect(spy).toHaveBeenCalled();

    });

    it('should not trigger filter menu change event when the filter context is not for plan home page', () => {
      const spy = spyOn(component, 'searchFlags').and.stub();
      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('if flags exist for the plan', () => {
    it('should return flags if they exist', () => {
      const spy = spyOn(component, 'searchFlags').and.stub();
      expect(component.hasPlans).toBeTruthy();
    });

    it('should show no flags when they dont exist for this plan', () => {
      const flagRequest = <IFlagsRequest>{
        customerNumber: 1234,
        isResolved: null
      };
      const flaggedplans = flagService.getPlansWithFlags1(flagRequest);
      flaggedplans.subscribe((res) => {
        if (res.plans.length > 0) {
          component.hasPlans = true;
        } else {
          component.hasPlans = false;
        }
      });
      expect(component.hasPlans).toBeFalsy();
    });
  });

  class MockFlagService {
    getPlansWithFlags(flagRequest: IFlagsRequest): Observable<IFlagsResponse> {
      return Observable.of(flagResponse);
    }
    getPlansWithFlags1(flagRequest: IFlagsRequest): Observable<IFlagsResponse> {
      return Observable.of(flagResponse1);
    }
    getFlags(planTag: IFlaggedPlan): IFlag[] {
      return flagResponse.plans[0].flags;
    }
  }

  class MockTestFlagLanding {
    flagsCount: number = 0;
    flaggedPlans: IFlaggedPlan[] = [];
  }

  class MockNavigatorServiceCustomer {
    subscribe(name: string, handler: any) {
      return customerContext;
    }

    unsubscribe(name: string) {
    }
  }

  class MockFilterBarService {
    getCoverageLinksByCustomerNumber(customerNumber: number): Observable<Array<IFilterLink>> {
      return Observable.of([]);
    }
  }
});






