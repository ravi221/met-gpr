import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {BrowserDynamicTestingModule} from '@angular/platform-browser-dynamic/testing';
import {By} from '@angular/platform-browser';
import {click} from '../../../../assets/test/TestHelper';
import {Component, DebugElement, ViewChild} from '@angular/core';
import {HelpDataService} from '../../services/help-data.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {IconComponent} from '../../../ui-controls/components/icon/icon.component';
import {ICustomer} from 'app/customer/interfaces/iCustomer';
import {IPlan} from '../../plan-shared/interfaces/iPlan';
import {MockNavigatorService} from '../../../navigation/services/navigator.service.mock';
import {ModalBackdropComponent} from '../../../ui-controls/components/modal/modal-backdrop/modal-backdrop.component';
import {ModalContainerComponent} from '../../../ui-controls/components/modal/modal-container/modal-container.component';
import {ModalService} from '../../../ui-controls/services/modal.service';
import {NavigatorService} from '../../../navigation/services/navigator.service';
import {PagingService} from 'app/ui-controls/services/paging.service';
import {PlanAction} from '../../enums/plan-action';
import {PlanContextMenuComponent} from './plan-context-menu.component';
import {PlanContextMenuService} from 'app/plan/services/plan-context-menu.service';
import {PlanDataService} from '../../plan-shared/services/plan-data.service';
import {PlanStatus} from '../../enums/plan-status';
import {RouterTestingModule} from '@angular/router/testing';
import {ScrollService} from 'app/ui-controls/services/scroll.service';
import {SortWithComparatorPipe} from '../../../core/pipes/sort-with-comparator.pipe';
import {TooltipContentComponent} from '../../../ui-controls/components/tooltip/tooltip-content.component';
import {TooltipDirective} from '../../../ui-controls/components/tooltip/tooltip.directive';
import {TooltipPositionService} from '../../../ui-controls/services/tooltip-position.service';
import {TooltipService} from '../../../ui-controls/services/tooltip.service';
import {UserProfileService} from 'app/core/services/user-profile.service';
import {AuthorizationService} from '../../../core/services/authorization.service';
import {UserPreferencesService} from '../../../core/services/user-preferences.service';
import {SortOptionsService} from 'app/core/services/sort-options.service';
import {DEFAULT_USER_ROLE} from '../../../../assets/test/common-objects/user-profile.mock';

describe('PlanContextMenuComponent', () => {
  let component: TestPlanContextMenuComponent;
  let fixture: ComponentFixture<TestPlanContextMenuComponent>;
  let contextMenu: DebugElement;
  let planActionOptions: DebugElement;
  let userProfileServiceSpy: jasmine.Spy;
  let planContextService: PlanContextMenuService;

  const plan = <IPlan>{planId: '1', status: PlanStatus.ACTIVE};
  const customer = <ICustomer>{customerNumber: 1234};
  let emitter: any;

  function toggleContextMenu() {
    click(contextMenu, fixture);
  }

  function selectPlanAction(index: number) {
    const planAction = planActionOptions.children[index].children[0];
    click(planAction, fixture);
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      declarations: [
        IconComponent,
        ModalBackdropComponent,
        ModalContainerComponent,
        PlanContextMenuComponent,
        SortWithComparatorPipe,
        TestPlanContextMenuComponent,
        TooltipContentComponent,
        TooltipDirective
      ],
      providers: [
        HelpDataService,
        ModalService,
        {provide: NavigatorService, useClass: MockNavigatorService},
        PagingService,
        PlanContextMenuService,
        PlanDataService,
        ScrollService,
        TooltipPositionService,
        TooltipService,
        UserProfileService,
        AuthorizationService,
        UserPreferencesService,
        SortOptionsService
      ]
    });
    TestBed.overrideModule(BrowserDynamicTestingModule, {
      set: {
        entryComponents: [ModalContainerComponent, ModalBackdropComponent]
      }
    });
  }));

  beforeEach(() => {
    userProfileServiceSpy = spyOn(TestBed.get(UserProfileService), 'getRoles').and.returnValue(DEFAULT_USER_ROLE);
    fixture = TestBed.createComponent(TestPlanContextMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    emitter = component.planContextMenuComponent.planAction;
    contextMenu = fixture.debugElement.query(By.css('.plan-context-menu-icon'));
    planActionOptions = fixture.debugElement.query(By.css('.tooltip-options-list'));

    planContextService = TestBed.get(PlanContextMenuService);
  });

  afterEach(() => {
    if (fixture) {
      fixture.destroy();
    }
    if (userProfileServiceSpy) {
      userProfileServiceSpy = null;
    }
  });

  describe('Events', () => {
    it('should call planContextService perform action for copy plan event', () => {
      const spy = spyOn(planContextService, 'performAction').and.stub();
      component.planContextMenuComponent.currentCustomer = customer;
      toggleContextMenu();
      selectPlanAction(0);

      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledWith(plan, customer, PlanAction.COPY, emitter);
    });

    it('should call planContextService perform action for export comments details plan event', () => {
      const spy = spyOn(planContextService, 'performAction').and.stub();
      component.planContextMenuComponent.currentCustomer = customer;
      toggleContextMenu();
      selectPlanAction(1);

      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledWith(plan, customer, PlanAction.EXPORT_COMMENTS, emitter);
    });

    it('should call planContextService perform action for export data details plan event', () => {
      const spy = spyOn(planContextService, 'performAction').and.stub();
      component.planContextMenuComponent.currentCustomer = customer;
      toggleContextMenu();
      selectPlanAction(2);

      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledWith(plan, customer, PlanAction.EXPORT_DATA_DETAIL, emitter);
    });

    it('should call planContextService perform action for retro revise plan event', () => {
      const spy = spyOn(planContextService, 'performAction').and.stub();
      component.planContextMenuComponent.currentCustomer = customer;
      toggleContextMenu();
      selectPlanAction(3);

      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledWith(plan, customer, PlanAction.RETRO_REVISE, emitter);
    });

    it('should call planContextService perform action for revise plan event', () => {
      const spy = spyOn(planContextService, 'performAction').and.stub();
      component.planContextMenuComponent.currentCustomer = customer;
      toggleContextMenu();
      selectPlanAction(4);

      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledWith(plan, customer, PlanAction.REVISE, emitter);
    });

    it('should call planContextService perform action for terminate plan event', () => {
      const spy = spyOn(planContextService, 'performAction').and.stub();

      component.planContextMenuComponent.currentCustomer = customer;
      toggleContextMenu();
      selectPlanAction(5);

      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledWith(plan, customer, PlanAction.TERMINATE, emitter);
    });

    it('should call planContextService perform action for cancel plan event', () => {
      const spy = spyOn(planContextService, 'performAction').and.stub();

      component.planContextMenuComponent.planActions = [
        PlanAction.CANCEL,
        PlanAction.DELETE,
        PlanAction.REVERT
      ];
      component.planContextMenuComponent.currentCustomer = customer;
      toggleContextMenu();
      selectPlanAction(0);

      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledWith(plan, customer, PlanAction.CANCEL, emitter);
    });

    it('should call planContextService perform action for delete plan event', () => {
      const spy = spyOn(planContextService, 'performAction').and.stub();
      component.planContextMenuComponent.planActions = [
        PlanAction.CANCEL,
        PlanAction.DELETE,
        PlanAction.REVERT
      ];
      component.planContextMenuComponent.currentCustomer = customer;
      toggleContextMenu();
      selectPlanAction(1);

      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledWith(plan, customer, PlanAction.DELETE, emitter);
    });

    it('should call planContextService perform action for revert plan event', () => {
      const spy = spyOn(planContextService, 'performAction').and.stub();
      component.planContextMenuComponent.planActions = [
        PlanAction.CANCEL,
        PlanAction.DELETE,
        PlanAction.REVERT
      ];
      component.planContextMenuComponent.currentCustomer = customer;
      toggleContextMenu();
      selectPlanAction(2);

      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledWith(plan, customer, PlanAction.REVERT, emitter);
    });
  });

  @Component({
    template: `
      <gpr-plan-context-menu [plan]="plan"></gpr-plan-context-menu>
    `
  })
  class TestPlanContextMenuComponent {
    plan: IPlan = plan;

    @ViewChild(PlanContextMenuComponent) planContextMenuComponent;
  }
});
