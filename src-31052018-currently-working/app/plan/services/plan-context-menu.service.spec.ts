import {AuthorizationService} from '../../core/services/authorization.service';
import {AutoSearchComponent} from '../../ui-controls/components/auto-search/auto-search.component';
import {BrowserDynamicTestingModule} from '@angular/platform-browser-dynamic/testing';
import {CustomerDataService} from '../../customer/services/customer-data.service';
import {CustomerSearchService} from '../../search/services/customer-search.service';
import {DatePickerComponent} from '../../ui-controls/components/date-picker/date-picker.component';
import {DatePickerDefaults} from '../../ui-controls/services/date-picker-defaults.service';
import {DatePipe} from '@angular/common';
import {DateService} from '../../core/services/date.service';
import {EventEmitter} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HelpDataService} from './help-data.service';
import {HelpTooltipComponent} from '../../ui-controls/components/help-tooltip/help-tooltip.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {IconComponent} from '../../ui-controls/components/icon/icon.component';
import {Idle, IdleExpiry} from '@ng-idle/core';
import {IPlanAction} from '../interfaces/iPlanAction';
import {IPlan} from '../plan-shared/interfaces/iPlan';
import {LogoutService} from '../../navigation/services/logout.service';
import {LogService} from '../../core/services/log.service';
import {MockIdleExpiry} from 'app/core/services/idle-expiry.mock';
import {MockPlanDataService} from '../plan-shared/services/plan-data.service.mock';
import {ModalBackdropComponent} from '../../ui-controls/components/modal/modal-backdrop/modal-backdrop.component';
import {ModalContainerComponent} from '../../ui-controls/components/modal/modal-container/modal-container.component';
import {ModalDefaultComponent} from '../../ui-controls/components/modal/modal-default/modal-default.component';
import {ModalService} from '../../ui-controls/services/modal.service';
import {NotificationService} from '../../core/services/notification.service';
import {Observable} from 'rxjs/Observable';
import {PagingService} from '../../ui-controls/services/paging.service';
import {PlanAction} from '../enums/plan-action';
import {PlanContextMenuService} from './plan-context-menu.service';
import {PlanCopyComponent} from '../components/plan-copy/plan-copy.component';
import {PlanDataService} from '../plan-shared/services/plan-data.service';
import {PlanInputGridComponent} from '../components/plan-input-grid/plan-input-grid.component';
import {PlanStatus} from '../enums/plan-status';
import {PlanTerminateComponent} from 'app/plan/components/plan-terminate/plan-terminate.component';
import {ProductDropDownComponent} from '../../core/components/product-drop-down/product-drop-down.component';
import {ProgressService} from '../../ui-controls/services/progress.service';
import {ScrollService} from '../../ui-controls/services/scroll.service';
import {SortOptionsService} from '../../core/services/sort-options.service';
import {SortWithComparatorPipe} from '../../core/pipes/sort-with-comparator.pipe';
import {Subscription} from 'rxjs/Subscription';
import {TestBed} from '@angular/core/testing';
import {TooltipContentComponent} from '../../ui-controls/components/tooltip/tooltip-content.component';
import {TooltipDirective} from '../../ui-controls/components/tooltip/tooltip.directive';
import {TooltipPositionService} from '../../ui-controls/services/tooltip-position.service';
import {TooltipService} from '../../ui-controls/services/tooltip.service';
import {UserPreferencesService} from '../../core/services/user-preferences.service';
import {UserProfileService} from '../../core/services/user-profile.service';
import {DEFAULT_USER_ROLE} from '../../../assets/test/common-objects/user-profile.mock';

describe('PlanContextMenuService', () => {
  let planContextMenuService: PlanContextMenuService;
  let planDataService: PlanDataService;
  let subscription: Subscription;
  let userProfileServiceSpy: jasmine.Spy;
  let checkPlanActions = (expectedPlanActions: PlanAction[], planStatus: PlanStatus) => {
    const actualPlanActions = planContextMenuService.getPlanActions(planStatus);
    expectedPlanActions.forEach((expectedPlanAction: PlanAction) => {
      expect(actualPlanActions).toContain(expectedPlanAction);
    });
    expect(actualPlanActions.length).toBe(expectedPlanActions.length);
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, HttpClientTestingModule],
      providers: [
        AuthorizationService,
        CustomerDataService,
        CustomerSearchService,
        DatePickerDefaults,
        DatePipe,
        DateService,
        HelpDataService,
        Idle,
        {provide: IdleExpiry, useClass: MockIdleExpiry},
        LogoutService,
        LogService,
        ModalService,
        NotificationService,
        PagingService,
        PlanContextMenuService,
        {provide: PlanDataService, useClass: MockPlanDataService},
        ProgressService,
        ScrollService,
        SortOptionsService,
        TooltipPositionService,
        TooltipService,
        UserPreferencesService,
        UserProfileService,
      ],
      declarations: [
        AutoSearchComponent,
        DatePickerComponent,
        HelpTooltipComponent,
        IconComponent,
        ModalBackdropComponent,
        ModalContainerComponent,
        ModalDefaultComponent,
        PlanCopyComponent,
        PlanInputGridComponent,
        PlanTerminateComponent,
        ProductDropDownComponent,
        SortWithComparatorPipe,
        TooltipContentComponent,
        TooltipDirective
      ]
    });
    TestBed.overrideModule(BrowserDynamicTestingModule, {
      set: {
        entryComponents: [
          PlanCopyComponent,
          PlanInputGridComponent,
          ModalContainerComponent,
          ModalBackdropComponent,
          ModalDefaultComponent,
          PlanTerminateComponent
        ],
      },
    });
    planContextMenuService = TestBed.get(PlanContextMenuService);
    planDataService = TestBed.get(PlanDataService);
    userProfileServiceSpy = spyOn(TestBed.get(UserProfileService), 'getRoles').and.returnValue(DEFAULT_USER_ROLE);
  });

  afterEach(() => {
    if (subscription) {
      subscription.unsubscribe();
      subscription = null;
    }
    if (userProfileServiceSpy) {
      userProfileServiceSpy = null;
    }
  });

  describe('Plan Actions by Status', () => {
    it('should return export, copy, revise, retro-revise, export comments and terminate for an \'ACTIVE\' plan', () => {
      const expectedPlanActions = [
        PlanAction.COPY,
        PlanAction.EXPORT_DATA_DETAIL,
        PlanAction.EXPORT_COMMENTS,
        PlanAction.RETRO_REVISE,
        PlanAction.REVISE,
        PlanAction.TERMINATE
      ];
      checkPlanActions(expectedPlanActions, PlanStatus.ACTIVE);
    });

    it('should return export, copy, revert, export comments and delete for a \'CANCELLED\' plan', () => {
      const expectedPlanActions = [
        PlanAction.COPY,
        PlanAction.DELETE,
        PlanAction.EXPORT_DATA_DETAIL,
        PlanAction.EXPORT_COMMENTS,
        PlanAction.REVERT
      ];
      checkPlanActions(expectedPlanActions, PlanStatus.CANCELLED);
    });

    it('should return export, copy, cancel, export comments and delete for an \'IN_PROGRESS\' plan', () => {
      const expectedPlanActions = [
        PlanAction.CANCEL,
        PlanAction.COPY,
        PlanAction.EXPORT_DATA_DETAIL,
        PlanAction.EXPORT_COMMENTS,
        PlanAction.DELETE
      ];
      checkPlanActions(expectedPlanActions, PlanStatus.IN_PROGRESS);
    });

    it('should return export, copy, export comments and delete for an \'IN_REVISION\' plan', () => {
      const expectedPlanActions = [
        PlanAction.COPY,
        PlanAction.EXPORT_DATA_DETAIL,
        PlanAction.EXPORT_COMMENTS,
        PlanAction.DELETE
      ];
      checkPlanActions(expectedPlanActions, PlanStatus.IN_REVISION);
    });

    it('should return cancel, export comments and delete for a \'NEW\' plan', () => {
      const expectedPlanActions = [
        PlanAction.CANCEL,
        PlanAction.DELETE,
        PlanAction.EXPORT_COMMENTS
      ];
      checkPlanActions(expectedPlanActions, PlanStatus.NEW);
    });

    it('should return copy, export, reinstate, and export comments for a \'WILL_TERMINATE\' plan', () => {
      const expectedPlanActions = [
        PlanAction.COPY,
        PlanAction.EXPORT_DATA_DETAIL,
        PlanAction.REINSTATE,
        PlanAction.EXPORT_COMMENTS
      ];
      checkPlanActions(expectedPlanActions, PlanStatus.WILL_TERMINATE);
    });

    it('should return copy, export, revise, and export comments for a \'TERMINATED\' plan', () => {
      const expectedPlanActions = [
        PlanAction.COPY,
        PlanAction.EXPORT_DATA_DETAIL,
        PlanAction.REVISE,
        PlanAction.EXPORT_COMMENTS
      ];
      checkPlanActions(expectedPlanActions, PlanStatus.TERMINATED);
    });

    it('should return empty plan actions when given a null plan status', () => {
      checkPlanActions([], null);
    });

    it('should return empty plan actions when given an undefined plan status', () => {
      checkPlanActions([], undefined);
    });
  });

  describe('Plan Actions by Role/Status', () => {
    it('should return export, export comments for an \'ACTIVE\' plan READONLY user', () => {
      userProfileServiceSpy.and.returnValue([{roleId: '13001', roleName: 'Support', roleTypeCode: 'SUPPORT'}]);
      const expectedPlanActions = [
        PlanAction.EXPORT_DATA_DETAIL,
        PlanAction.EXPORT_COMMENTS
      ];
      checkPlanActions(expectedPlanActions, PlanStatus.ACTIVE);
    });
  });

  it('should sort plan actions alphabetically', () => {
    const planActions: PlanAction[] = planContextMenuService.getPlanActions(PlanStatus.ACTIVE);

    for (let i = 1; i < planActions.length; i++) {
      const order = planActions[i - 1].localeCompare(planActions[i]);
      expect(order).toBe(-1);
    }
  });

  describe('ModalRef Type Checks', () => {
    let openModalSpy: jasmine.Spy;

    beforeEach(() => {
      openModalSpy = spyOn(TestBed.get(ModalService), 'open').and.stub();
    });

    it('should open a modal when cancelling a plan', () => {
      planContextMenuService.getCancelActionModal();
      expect(openModalSpy).toHaveBeenCalled();
      expect(openModalSpy.calls.mostRecent().args[0]).toMatch(/ModalDefaultComponent/);
    });

    it('should open a modal when deleting a plan', () => {
      planContextMenuService.getDeleteActionModal();
      expect(openModalSpy).toHaveBeenCalled();
      expect(openModalSpy.calls.mostRecent().args[0]).toMatch(/ModalDefaultComponent/);
    });

    it('should open a modal when reinstating a plan', () => {
      planContextMenuService.getReinstateActionModal();
      expect(openModalSpy).toHaveBeenCalled();
      expect(openModalSpy.calls.mostRecent().args[0]).toMatch(/ModalDefaultComponent/);
    });

    it('should open a modal when retro-revising a plan', () => {
      planContextMenuService.getRetroReviseActionModal();
      expect(openModalSpy).toHaveBeenCalled();
      expect(openModalSpy.calls.mostRecent().args[0]).toMatch(/ModalDefaultComponent/);
    });

    it('should open a modal when reverting a plan', () => {
      planContextMenuService.getRevertActionModal();
      expect(openModalSpy).toHaveBeenCalled();
      expect(openModalSpy.calls.mostRecent().args[0]).toMatch(/ModalDefaultComponent/);
    });

    it('should open a modal when revising a plan', () => {
      planContextMenuService.getReviseActionModal();
      expect(openModalSpy).toHaveBeenCalled();
      expect(openModalSpy.calls.mostRecent().args[0]).toMatch(/ModalDefaultComponent/);
    });

    it('should open a modal when terminating a plan', () => {
      planContextMenuService.getTerminateActionModal();
      expect(openModalSpy).toHaveBeenCalled();
      expect(openModalSpy.calls.mostRecent().args[0]).toMatch(/PlanTerminateComponent/);
    });

    it('should open a modal when copying a plan', () => {
      planContextMenuService.getCopyActionModal(null, null);
      expect(openModalSpy).toHaveBeenCalled();
      expect(openModalSpy.calls.mostRecent().args[0]).toMatch(/PlanCopyComponent/);
    });

    it('should open a modal when exporting comments for a plan', () => {
      planContextMenuService.getExportCommentsActionModal();
      expect(openModalSpy).toHaveBeenCalled();
      expect(openModalSpy.calls.mostRecent().args[0]).toMatch(/ModalDefaultComponent/);
    });
  });

  describe('Check Emitters', () => {
    // Still need Copy


    it('should emit when Cancel Modal is closed', (done) => {
      const spy = spyOn(planDataService, 'cancelPlan').and.callFake((id) => {
        return Observable.of('');
      });
      let emitter: EventEmitter<any> = new EventEmitter<any>();
      subscription = emitter.subscribe((result) => {
        expect(result.planAction === PlanAction.CANCEL).toBeTruthy();
        expect(result.data).toBeDefined();
        expect(result.data.message).toBe('TestPlan was successfully cancelled.');
        done();
      });
      let modal = planContextMenuService.getCancelActionModal();
      planContextMenuService.handleCancelModalAction(
        <IPlan>{planId: '1', status: 'Active', planName: 'TestPlan'},
        emitter, modal);
      modal.close();
      expect(spy).toHaveBeenCalled();
    });
    it('should emit when Delete Modal is closed', (done) => {
      const spy = spyOn(planDataService, 'deletePlan').and.callFake((id) => {
        return Observable.of('');
      });
      let emitter: EventEmitter<any> = new EventEmitter<any>();
      subscription = emitter.subscribe((result) => {
        expect(result.planAction === PlanAction.DELETE).toBeTruthy();
        expect(result.data).toBeDefined();
        expect(result.data.message).toBe('TestPlan was successfully deleted.');
        done();
      });
      let modal = planContextMenuService.getDeleteActionModal();
      planContextMenuService.handleDeleteAction(
        <IPlan>{planId: '1', status: 'Active', planName: 'TestPlan'},
        emitter, modal);
      modal.close();
      expect(spy).toHaveBeenCalled();
    });
    it('should emit when Terminate Modal is closed', (done) => {
      let emitter: EventEmitter<any> = new EventEmitter<any>();
      const spy = spyOn(TestBed.get(PlanDataService), 'terminatePlan').and.returnValue(Observable.of([]));
      subscription = emitter.subscribe((result) => {
        expect(result.planAction === PlanAction.TERMINATE).toBeTruthy();
        expect(result.data).toBeDefined();
        expect(result.data.message).toBe('TestPlan was successfully terminated.');
        expect(result.data.terminationDate).toBe('1/1/2018');
        done();
      });
      let modal = planContextMenuService.getTerminateActionModal();
      planContextMenuService.handleTerminateAction(
        <IPlan>{planId: '1', status: 'Active', planName: 'TestPlan'},
        emitter, modal);
      modal.close({
        terminationDate: '1/1/2018'
      });
      expect(spy).toHaveBeenCalled();
    });
    it('should emit error when Terminate Modal is closed without termination date', (done) => {
      let emitter: EventEmitter<any> = new EventEmitter<any>();
      const spy = spyOn(TestBed.get(PlanDataService), 'terminatePlan').and.returnValue(Observable.of([]));
      subscription = emitter.subscribe((result: IPlanAction) => {
        expect(result.planAction === PlanAction.TERMINATE).toBeTruthy();
        expect(result.data).toBeUndefined();
        expect(result.error).toBe('Termination Date was not provided');
        done();
      });
      let modal = planContextMenuService.getTerminateActionModal();
      planContextMenuService.handleTerminateAction(
        <IPlan>{planId: '1', status: 'Active', planName: 'TestPlan'},
        emitter, modal);
      modal.close();
      expect(spy).toHaveBeenCalledTimes(0);
    });
    it('should emit when Export Comments Modal is closed', (done) => {
      let emitter: EventEmitter<any> = new EventEmitter<any>();
      subscription = emitter.subscribe((result) => {
        expect(result.planAction === PlanAction.EXPORT_COMMENTS).toBeTruthy();
        done();
      });
      let modal = planContextMenuService.getExportCommentsActionModal();
      planContextMenuService.handleExportCommentsAction(
        <IPlan>{planId: '1', status: 'Active', planName: 'TestPlan'},
        emitter, modal);
      modal.close();
    });
    it('should emit when Revise Modal is closed', (done) => {
      let emitter: EventEmitter<any> = new EventEmitter<any>();
      subscription = emitter.subscribe((result) => {
        expect(result.planAction === PlanAction.REVISE).toBeTruthy();
        expect(result.data).toBeDefined();
        expect(result.data.message).toBe('TestPlan was successfully Revised.');
        done();
      });
      let modal = planContextMenuService.getReviseActionModal();
      planContextMenuService.handleReviseAction(
        <IPlan>{planId: '1', status: 'Active', planName: 'TestPlan'},
        emitter, modal);
      modal.close();
    });
    it('should emit when Retro Revise Modal is closed', (done) => {
      let emitter: EventEmitter<any> = new EventEmitter<any>();
      subscription = emitter.subscribe((result) => {
        expect(result.planAction === PlanAction.RETRO_REVISE).toBeTruthy();
        expect(result.data).toBeDefined();
        expect(result.data.message).toBe('TestPlan was successfully Retro Revised.');
        done();
      });
      let modal = planContextMenuService.getRetroReviseActionModal();
      planContextMenuService.handleRetroReviseAction(
        <IPlan>{planId: '1', status: 'Active', planName: 'TestPlan'},
        emitter, modal);
      modal.close();
    });
    it('should emit when Revert Modal is closed', (done) => {
      let emitter: EventEmitter<any> = new EventEmitter<any>();
      subscription = emitter.subscribe((result) => {
        expect(result.planAction === PlanAction.REVERT).toBeTruthy();
        expect(result.data).toBeDefined();
        expect(result.data.message).toBe('TestPlan was successfully Reverted.');
        done();
      });
      let modal = planContextMenuService.getRevertActionModal();
      planContextMenuService.handleRevertAction(
        <IPlan>{planId: '1', status: 'Active', planName: 'TestPlan'},
        emitter, modal);
      modal.close();
    });
    it('should emit when Reinstate Modal is closed', (done) => {
      let emitter: EventEmitter<any> = new EventEmitter<any>();
      subscription = emitter.subscribe((result) => {
        expect(result.planAction === PlanAction.REINSTATE).toBeTruthy();
        expect(result.data).toBeDefined();
        expect(result.data.message).toBe('TestPlan was successfully Reinstated.');
        done();
      });
      let modal = planContextMenuService.getReinstateActionModal();
      planContextMenuService.handleReinstateAction(
        <IPlan>{planId: '1', status: 'Active', planName: 'TestPlan'},
        emitter, modal);
      modal.close();
    });
  });
});
