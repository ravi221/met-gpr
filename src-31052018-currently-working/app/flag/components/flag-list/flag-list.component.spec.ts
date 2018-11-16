import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {FlagListComponent} from './flag-list.component';
import {DebugElement} from '@angular/core';
import {IFlaggedPlan} from '../../interfaces/iFlaggedPlan';
import {By} from '@angular/platform-browser';
import {Observable} from 'rxjs/Observable';
import {FilterService} from 'app/core/services/filter.service';
import {IconComponent} from '../../../ui-controls/components/icon/icon.component';
import {LoadingIconComponent} from '../../../ui-controls/components/loading-icon/loading-icon.component';
import {ModalService} from '../../../ui-controls/services/modal.service';
import {ModalContainerComponent} from 'app/ui-controls/components/modal/modal-container/modal-container.component';
import {ActiveModalRef} from 'app/ui-controls/classes/modal-references';
import {BrowserDynamicTestingModule} from '@angular/platform-browser-dynamic/testing';
import {ModalBackdropComponent} from 'app/ui-controls/components/modal/modal-backdrop/modal-backdrop.component';
import {FlaggedPlanComponent} from '../flagged-plan/flagged-plan.component';
import {FlagItemComponent} from '../flag-item/flag-item.component';
import {CardComponent} from '../../../ui-controls/components/card/card.component';
import {EmailLinkComponent} from '../../../ui-controls/components/email-link/email-link.component';
import {FlagLandingComponent} from '../flag-landing/flag-landing.component';
import {FilterBarComponent} from '../../../core/components/filter-bar/filter-bar.component';
import {FilterMenuComponent} from '../../../core/components/filter-menu/filter-menu.component';
import {SortMenuComponent} from '../../../core/components/sort-menu/sort-menu.component';
import {TooltipContentComponent} from '../../../ui-controls/components/tooltip/tooltip-content.component';
import {FlagFilterService} from '../../services/flag-filter.service';
import {TooltipService} from '../../../ui-controls/services/tooltip.service';
import {TooltipPositionService} from '../../../ui-controls/services/tooltip-position.service';
import {TooltipDirective} from '../../../ui-controls/components/tooltip/tooltip.directive';
import {FlagFilterComponent} from '../flag-filter/flag-filter.component';
import {FormsModule} from '@angular/forms';
import {NavigatorService} from '../../../navigation/services/navigator.service';
import {RouterTestingModule} from '@angular/router/testing';
import {FilterLinkService} from '../../../core/services/filter-link.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {PagingService} from '../../../ui-controls/services/paging.service';
import {ScrollService} from '../../../ui-controls/services/scroll.service';
import {ExpandCollapseIconComponent} from '../../../ui-controls/components/expand-collapse-icon/expand-collapse-icon.component';
import {click} from '../../../../assets/test/TestHelper';
import { ProductDataService } from '../../../core/services/product-data.service';
import { IFlagsResponse } from 'app/flag/interfaces/iFlagsResponse';
import { IFlagsRequest } from 'app/flag/interfaces/iFlagsRequest';
import { IFlag } from 'app/flag/interfaces/iFlag';
import { FlagService } from 'app/flag/services/flag.service';
import { FlagResolverPopupComponent } from 'app/flag/components/flag-resolver-popup/flag-resolver-popup.component';
import { PlanDataService } from 'app/plan/plan-shared/services/plan-data.service';
import { CustomerStatus } from 'app/customer/enums/customer-status';
import { FilterLinksComponent } from '../../../core/components/filter-links/filter-links.component';
import { FilterChipsComponent } from '../../../core/components/filter-chips/filter-chips.component';
import {MockNavigatorService} from '../../../navigation/services/navigator.service.mock';

describe('FlagListComponent', () => {
  let component: FlagListComponent;
  let fixture: ComponentFixture<FlagListComponent>;
  let flagService: FlagService;
  let collapseBtn: DebugElement;

  let mockFlagResponse = <IFlagsResponse>{
    totalFlagCount: 1,
    plans: [{
      planId: '1',
      planName: 'Test Plan Name',
      flags: [{
        questionName: 'test',
        questionValue: 'question value',
        text: 'comment',
        lastUpdatedBy: 'John Smith',
        lastUpdatedByEmail: 'js@metlife.com',
        lastUpdatedTimestamp: '02-12-2018 16:32:59.910',
        isResolved: false
      }]
    }]
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        RouterTestingModule,
        HttpClientTestingModule
      ],
      declarations: [
        FilterLinksComponent,
        FilterChipsComponent,
        FilterBarComponent,
        TooltipDirective,
        TooltipContentComponent,
        FlagFilterComponent,
        FilterMenuComponent,
        SortMenuComponent,
        FlagLandingComponent,
        FlaggedPlanComponent,
        FlagItemComponent,
        CardComponent,
        EmailLinkComponent,
        FlagListComponent,
        IconComponent,
        LoadingIconComponent,
        FlagResolverPopupComponent,
        ModalContainerComponent,
        ModalBackdropComponent,
        ExpandCollapseIconComponent
      ],
      providers: [
        ProductDataService,
        FilterService,
        FilterLinkService,
        ModalService,
        TooltipService,
        PlanDataService,
        TooltipPositionService,
        FlagLandingComponent,
        {provide: NavigatorService, useClass: MockNavigatorService},
        PagingService,
        ScrollService,
        FlagFilterService,
        FlagService,
        {provide: FlagService, useClass: MockFlagService},
        {provide: ActiveModalRef, useClass: MockActiveModal}
      ]
    });
    TestBed.overrideModule(BrowserDynamicTestingModule, {
      set: {
        entryComponents: [ModalContainerComponent, ModalBackdropComponent]
      }
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlagListComponent);
    component = fixture.componentInstance;
    component.customer = {
      customerName: 'Test Customer',
      customerNumber: 1234,
      effectiveDate: null,
      status: CustomerStatus.UNAPPROVED,
      percentageCompleted: 50,
      market: 'Small Market',
      hiddenStatus: false,
      scrollVisibility: true
    };
    component.flagsCount = mockFlagResponse['totalFlagCount'];
    component.flaggedPlans = mockFlagResponse['plans'];
    fixture.detectChanges();
    flagService = TestBed.get(FlagService);
    collapseBtn = fixture.debugElement.query(By.css('.expand-collapse-icon'));
  });

  afterEach(() => {
    if (fixture) {
      fixture.destroy();
    }
  });

  describe('Flag List header', () => {
    it('should properly show customer name in the header', () => {
      const flagListHeader = fixture.debugElement.query(By.css('.customer-title'));
      expect(flagListHeader.nativeElement.innerHTML.trim()).toBe('Test Customer');
    });
  });

  describe('Flag List', () => {
    it('should hide customer detail info by default', () => {
      expect(component.shouldDisplayDetails).toBeFalsy();
      click(collapseBtn, fixture);
      expect(component.shouldDisplayDetails).toBeTruthy();
    });

    it('should expand customer detail info when collapse button is clicked', () => {
      click(collapseBtn, fixture);
      expect(component.shouldDisplayDetails).toBeTruthy();
      click(collapseBtn, fixture);
      expect(component.shouldDisplayDetails).toBeFalsy();
    });
  });

  describe('Flag List resolver container', () => {
    it('should properly show flag count', () => {
      const flagsCount = fixture.debugElement.query(By.css('.flags-count'));
      expect(Number(flagsCount.nativeElement.innerHTML)).toBe(1);
    });
  });

  describe('Data Binding', () => {
    it('should not render the number of flags when the flags count equals 0', () => {
      const flags = fixture.debugElement.query(By.css('.flags-count'));
      expect(flags).toBeTruthy();
      expect(flags.children).toBeTruthy();
      expect(flags.children.length).toBe(0);
    });

    it('should render the number of flags when the flags count is greater than 0', () => {
      component = fixture.componentInstance;
      component.customer = {
        customerName: 'Test Customer',
        customerNumber: 1234,
        effectiveDate: null,
        status: CustomerStatus.UNAPPROVED,
        percentageCompleted: 50,
        market: 'Small Market',
        hiddenStatus: false,
        scrollVisibility: true
      };
      component.flagsCount = mockFlagResponse['totalFlagCount'];
      component.flaggedPlans = mockFlagResponse['plans'];
      fixture.detectChanges();
      const flags = fixture.debugElement.query(By.css('.flags-count'));
      expect(flags).toBeTruthy();
      const actualFlagsCount = flags.nativeElement.innerText;
      expect(actualFlagsCount).toBe('1');
    });
  });

  describe('Flag List ', () => {
    it('should trigger resolve all when button clicked', () => {
      const spy = spyOn(component, 'handleResolveAll').and.stub();
      const link = fixture.debugElement.query(By.css('.resolve-link'));
      click(link);
      expect(spy).toHaveBeenCalled();
    });
  });

  class MockFlagService {
    getPlansWithFlags(flagRequest: IFlagsRequest): Observable<IFlagsResponse> {
      return Observable.of(mockFlagResponse);
    }
    getFlags(planTag: IFlaggedPlan): IFlag[] {
      return mockFlagResponse.plans[0].flags;
    }
  }

  class MockActiveModal {
    dismiss() {}
    close(any) {}
    onClose() {
      return Observable.of({});
    }
  }
});
