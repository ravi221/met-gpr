import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {FlagResolverPopupComponent} from './flag-resolver-popup.component';
import {ActiveModalRef} from '../../../ui-controls/classes/modal-references';
import {Component, ViewChild} from '@angular/core';
import {ICustomer} from '../../../customer/interfaces/iCustomer';
import {IFlaggedPlan} from '../../interfaces/iFlaggedPlan';
import {By} from '@angular/platform-browser';
import {click} from '../../../../assets/test/TestHelper';
import { FlagService } from 'app/flag/services/flag.service';
import { IFlag } from 'app/flag/interfaces/iFlag';
import { CommentService } from '../../../comment/services/comment.service';
import { CustomerStatus } from 'app/customer/enums/customer-status';
import { NotificationService } from '../../../core/services/notification.service';
import { FlagLandingComponent } from '../flag-landing/flag-landing.component';
import { FilterBarComponent } from '../../../core/components/filter-bar/filter-bar.component';
import { FlagFilterComponent } from '../flag-filter/flag-filter.component';
import { CardComponent } from '../../../ui-controls/components/card/card.component';
import { FlagListComponent } from '../flag-list/flag-list.component';
import { IconComponent } from '../../../ui-controls/components/icon/icon.component';
import { FilterLinksComponent } from '../../../core/components/filter-links/filter-links.component';
import { FilterMenuComponent } from '../../../core/components/filter-menu/filter-menu.component';
import { SortMenuComponent } from '../../../core/components/sort-menu/sort-menu.component';
import { FilterChipsComponent } from '../../../core/components/filter-chips/filter-chips.component';
import { LoadingIconComponent } from '../../../ui-controls/components/loading-icon/loading-icon.component';
import { ExpandCollapseIconComponent } from '../../../ui-controls/components/expand-collapse-icon/expand-collapse-icon.component';
import { FlaggedPlanComponent } from '../flagged-plan/flagged-plan.component';
import { TooltipContentComponent } from '../../../ui-controls/components/tooltip/tooltip-content.component';
import { TooltipService } from '../../../ui-controls/services/tooltip.service';
import { TooltipDirective } from 'app/ui-controls/components/tooltip/tooltip.directive';
import { TooltipPositionService } from 'app/ui-controls/services/tooltip-position.service';
import { FlagFilterService } from 'app/flag/services/flag-filter.service';
import { FilterService } from '../../../core/services/filter.service';
import { FormsModule } from '@angular/forms';
import { FlagItemComponent } from '../flag-item/flag-item.component';
import { EmailLinkComponent } from '../../../ui-controls/components/email-link/email-link.component';
import { ModalService } from '../../../ui-controls/services/modal.service';
import { ModalContainerComponent } from '../../../ui-controls/components/modal/modal-container/modal-container.component';
import { ModalBackdropComponent } from 'app/ui-controls/components/modal/modal-backdrop/modal-backdrop.component';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { NavigatorService } from '../../../navigation/services/navigator.service';
import { RouterTestingModule } from '@angular/router/testing';
import { LoadingSpinnerService } from '../../../ui-controls/services/loading-spinner.service';
import { FilterLinkService } from '../../../core/services/filter-link.service';
import { PlanDataService } from '../../../plan/plan-shared/services/plan-data.service';
import { PagingService } from '../../../ui-controls/services/paging.service';
import { ScrollService } from '../../../ui-controls/services/scroll.service';
import { ProductDataService } from '../../../core/services/product-data.service';
import { FlagLandingStubComponent } from 'app/flag/components/flag-landing/flag-landing.component.stub';

describe('FlagResolverPopupComponent', () => {
  let component: TestFlagPopupComponent;
  let fixture: ComponentFixture<TestFlagPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule, FormsModule],
      declarations: [
        FlagLandingStubComponent,
        FlagFilterComponent,
        TooltipDirective,
        TooltipContentComponent,
        FlagResolverPopupComponent,
        TestFlagPopupComponent,
        FilterBarComponent,
        CardComponent,
        FlagListComponent,
        IconComponent,
        FilterLinksComponent,
        FilterMenuComponent,
        SortMenuComponent,
        FilterChipsComponent,
        LoadingIconComponent,
        ExpandCollapseIconComponent,
        FlaggedPlanComponent,
        FlagItemComponent,
        EmailLinkComponent,
        ModalContainerComponent,
        ModalBackdropComponent],
      providers: [
        {provide: ActiveModalRef, useClass: MockActiveModal},
        ModalService,
        FlagLandingComponent,
        TooltipService,
        TooltipPositionService,
        FilterService,
        FlagFilterService,
        FlagService,
        CommentService,
        NotificationService,
        NavigatorService,
        LoadingSpinnerService,
        FilterLinkService,
        PlanDataService,
        PagingService,
        ScrollService,
        ProductDataService
      ],
    });

    TestBed.overrideModule(BrowserDynamicTestingModule, {
      set: {
        entryComponents: [ModalContainerComponent, ModalBackdropComponent]
      }
    });
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(TestFlagPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  afterEach(() => {
    if (fixture) {
      fixture.destroy();
    }
  });

  it('The FlagResolver should be created', () => {
    expect(component.flagPopup).toBeTruthy();
  });
  it('Correct Template Descriptions for multiple Flags', () => {
    expect(component.flagPopup.retainText).toEqual('Retain Flag');
    expect(component.flagPopup.title).toEqual('Resolve Flag');
    expect(component.flagPopup.question).toEqual('Are you sure you want to resolve this flag for ' + component.flagPopup.customer.customerName + '?');
  });

  it('The FlagResolver should be created', () => {
    expect(component.flagPopup).toBeTruthy();
  });
  it('Correct Template Descriptions for multiple Flags', () => {
    expect(component.flagPopup.retainText).toEqual('Retain Flag');
    expect(component.flagPopup.title).toEqual('Resolve Flag');
    expect(component.flagPopup.question).toEqual('Are you sure you want to resolve this flag for ' + component.flagPopup.customer.customerName + '?');
  });


  it('should display correct message when resolving flag', () => {
    expect(component.flagPopup.retainText).toEqual('Retain Flag');
    expect(component.flagPopup.title).toEqual('Resolve Flag');
    expect(component.flagPopup.question).toEqual('Are you sure you want to resolve this flag for ' + component.flagPopup.customer.customerName + '?');
  });

  it('should display correct message when resolving one flag', () => {
    component.flag = component.flag[0];
    fixture.detectChanges();
    component.flagPopup.ngOnInit();

    expect(component.flagPopup.retainText).toEqual('Retain Flag');
    expect(component.flagPopup.title).toEqual('Resolve Flag');
    expect(component.flagPopup.question).toEqual('Are you sure you want to resolve this flag for ' + component.flagPopup.customer.customerName + '?');
  });

  it('should trigger confirm button click', () => {
    const spy = spyOn(component.flagPopup, 'resolveFlags').and.callThrough();
    const link = fixture.debugElement.query(By.css('.confirm-link-resolver'));
    click(link);
    expect(spy).toHaveBeenCalled();
  });

  it('should trigger cancel button click', () => {
    const spy = spyOn(component.flagPopup, 'cancel').and.stub();
    const link = fixture.debugElement.query(By.css('.cancel-link-resolver'));
    click(link);
    expect(spy).toHaveBeenCalled();
  });


  @Component({
    template: `
    <gpr-flag-resolver-popup [flag]="flag" [customer]="customer" [planDetails]="planDetails"></gpr-flag-resolver-popup>
  `
  })
  class TestFlagPopupComponent {
    @ViewChild(FlagResolverPopupComponent) flagPopup;
    public flag: IFlag = {
        questionId: '1',
        questionName: 'Plan Name',
        questionValue: 'Josh\'s Flags',
        text: 'Some Text for a Flag',
        lastUpdatedBy: 'Josh',
        lastUpdatedByEmail: 'jbuchanan1@metlife.com',
        lastUpdatedTimestamp: '02-12-2018 16:32:59.9107',
        isResolved: true
      };
    public customer: ICustomer = {
      customerName: 'test',
      customerNumber: 1234,
      effectiveDate: null,
      status: CustomerStatus.UNAPPROVED,
      percentageCompleted: 50,
      market: 'Small Market',
      hiddenStatus: false,
      scrollVisibility: true
    };

    public planDetails: IFlaggedPlan = {
      planId: '1',
      planName: 'Test Plan Name',
      flags: [
        {
          questionId: '1',
          text: 'comment',
          questionName: 'test',
          questionValue: 'question value',
          isResolved: false,
          lastUpdatedBy: 'John Smith',
          lastUpdatedByEmail: 'js@metlife.com',
          lastUpdatedTimestamp: '02-12-2018 16:32:59.910'
        }
      ]
    };
  }


  class MockActiveModal {
    dismiss() {
    }

    close(any) {
    }
  }

});
