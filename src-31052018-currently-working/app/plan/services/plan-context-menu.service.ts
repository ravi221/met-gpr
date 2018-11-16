import {Component, EventEmitter, Injectable, Type} from '@angular/core';
import {IPlan} from '../plan-shared/interfaces/iPlan';
import {PlanAction} from '../enums/plan-action';
import {ModalRef} from '../../../app/ui-controls/classes/modal-references';
import {PlanCopyComponent} from '../../../app/plan/components/plan-copy/plan-copy.component';
import {ModalService} from '../../../app/ui-controls/services/modal.service';
import {ModalDefaultComponent} from '../../../app/ui-controls/components/modal/modal-default/modal-default.component';
import {PlanDataService} from '../plan-shared/services/plan-data.service';
import {Observable} from 'rxjs/Observable';
import {ICustomer} from 'app/customer/interfaces/iCustomer';
import {PlanStatus} from '../enums/plan-status';
import {IPlanAction} from '../interfaces/iPlanAction';
import {PlanTerminateComponent} from 'app/plan/components/plan-terminate/plan-terminate.component';
import {isNil} from 'lodash';
import {DownloadHelper} from '../../core/utilities/download-helper';
import {UserProfileService} from '../../core/services/user-profile.service';
import {AccessRoleType} from '../../core/enums/access-role-type';
import {AccessLevelUtility} from '../../core/utilities/access-level-utility';

/**
 * Service to get the actions a user is able to perform on a given plan
 */
@Injectable()
export class PlanContextMenuService {

  private _roleAccessRestriction = {
    [AccessRoleType.KNOWLEDGE]: [
      PlanAction.CANCEL,
      PlanAction.COPY,
      PlanAction.DELETE,
      PlanAction.REINSTATE,
      PlanAction.RETRO_REVISE,
      PlanAction.REVERT,
      PlanAction.REVISE,
      PlanAction.TERMINATE
    ],
    [AccessRoleType.NOT_FOUND]: [
      PlanAction.CANCEL,
      PlanAction.COPY,
      PlanAction.DELETE,
      PlanAction.REINSTATE,
      PlanAction.RETRO_REVISE,
      PlanAction.REVERT,
      PlanAction.REVISE,
      PlanAction.TERMINATE
    ],
    [AccessRoleType.STANDARD]: [
    ],
    [AccessRoleType.SUPER]: [
    ],
    [AccessRoleType.SUPPORT]: [
      PlanAction.CANCEL,
      PlanAction.COPY,
      PlanAction.DELETE,
      PlanAction.REINSTATE,
      PlanAction.RETRO_REVISE,
      PlanAction.REVERT,
      PlanAction.REVISE,
      PlanAction.TERMINATE
    ]
  };

  /**
   * Object containing which statuses allow which plan actions
   */
  private _planActionsByStatus = {
    [PlanStatus.ACTIVE]: [
      PlanAction.EXPORT_DATA_DETAIL,
      PlanAction.COPY,
      PlanAction.REVISE,
      PlanAction.RETRO_REVISE,
      PlanAction.TERMINATE,
      PlanAction.EXPORT_COMMENTS
    ],
    [PlanStatus.CANCELLED]: [
      PlanAction.EXPORT_DATA_DETAIL,
      PlanAction.COPY,
      PlanAction.REVERT,
      PlanAction.DELETE,
      PlanAction.EXPORT_COMMENTS
    ],
    [PlanStatus.IN_PROGRESS]: [
      PlanAction.EXPORT_DATA_DETAIL,
      PlanAction.COPY,
      PlanAction.CANCEL,
      PlanAction.DELETE,
      PlanAction.EXPORT_COMMENTS
    ],
    [PlanStatus.IN_REVISION]: [
      PlanAction.EXPORT_DATA_DETAIL,
      PlanAction.COPY,
      PlanAction.DELETE,
      PlanAction.EXPORT_COMMENTS
    ],
    [PlanStatus.NEW]: [
      PlanAction.CANCEL,
      PlanAction.DELETE,
      PlanAction.EXPORT_COMMENTS
    ],
    [PlanStatus.WILL_TERMINATE]: [
      PlanAction.COPY,
      PlanAction.EXPORT_DATA_DETAIL,
      PlanAction.REINSTATE,
      PlanAction.EXPORT_COMMENTS
    ],
    [PlanStatus.TERMINATED]: [
      PlanAction.COPY,
      PlanAction.EXPORT_DATA_DETAIL,
      PlanAction.REVISE,
      PlanAction.EXPORT_COMMENTS
    ]
  };

  /**
   * Creates the plan context menu service
   */
  constructor(private _modalService: ModalService,
    private _planDataService: PlanDataService,
    private _userProfile: UserProfileService) {
  }

  /**
   * Gets the actions allowed to perform on a plan, based on the plan status
   */
  public getPlanActions(planStatus: PlanStatus): PlanAction[] {
    const planActions = this._planActionsByStatus[planStatus];
    if (planActions) {
      return this._removeActionsBasedOnUserRole([...planActions.sort()]);
    }
    return [];
  }

  /**
   * Single method used to perform various actions upon a given plan
   */
  public performAction(plan: IPlan, currentCustomer: ICustomer, planAction: PlanAction, emitter: EventEmitter<IPlanAction>) {
    switch (planAction) {
      case PlanAction.COPY:
        this.handleCopyModalAction(plan, currentCustomer, emitter);
        break;
      case PlanAction.CANCEL:
        this.handleCancelModalAction(plan, emitter);
        break;
      case PlanAction.DELETE:
        this.handleDeleteAction(plan, emitter);
        break;
      case PlanAction.EXPORT_DATA_DETAIL:
        this.handleExportAction(plan, emitter);
        break;
      case PlanAction.REINSTATE:
        this.handleReinstateAction(plan, emitter);
        break;
      case PlanAction.RETRO_REVISE:
        this.handleRetroReviseAction(plan, emitter);
        break;
      case PlanAction.REVERT:
        this.handleRevertAction(plan, emitter);
        break;
      case PlanAction.REVISE:
        this.handleReviseAction(plan, emitter);
        break;
      case PlanAction.TERMINATE:
        this.handleTerminateAction(plan, emitter);
        break;
      case PlanAction.EXPORT_COMMENTS:
        this.handleExportCommentsAction(plan, emitter);
        break;
      default:
        emitter.emit(<IPlanAction>{});
        break;
    }
  }

  //#region Copy
  /**
   * Called to get reference to Modal window to copy plan
   */
  public getCopyActionModal(plan: IPlan, currentCustomer: ICustomer): ModalRef {
    let componentType: Type<Component> = PlanCopyComponent as Type<Component>;
    let inputs: Map<string, any> = new Map<string, any>();
    inputs.set('planToCopy', plan);
    inputs.set('customerToCopyTo', currentCustomer);
    return this._modalService.open(componentType, {
      backdrop: true,
      size: 'lg',
      closeOnEsc: true,
      inputs: inputs,
      containerClass: 'plan-copy-container'
    });
  }

  /**
   * Opens modal window to copy a plan and emits when completed
   */
  public handleCopyModalAction(plan: IPlan, currentCustomer: ICustomer, emitter: EventEmitter<IPlanAction>, modal?: ModalRef): void {
    if (!modal) {
      modal = this.getCopyActionModal(plan, currentCustomer);
    }
    const planAction = PlanAction.COPY;
    const modalSubscription = modal.onClose.subscribe(data => {
      emitter.emit(<IPlanAction>{plan, planAction, data});
    });
  }

  //#endregion

  //#region Delete
  /**
   * Method used to get Delete ModalRef
   */
  public getDeleteActionModal(): ModalRef {
    return this._launchModalWindow('Delete Plan',
      'Are you sure you want to delete this plan? This action will permanently remove this record',
      'Dismiss', 'Delete Plan', 'Removes a plan completely from the system. Active plans cannot be deleted.');
  }

  /**
   * Method used to handle the Delete action on a given plan
   * @param plan Plan used to Delete
   * @param {EventEmitter<IPlanAction>} emitter Emitter used to send information back to consumers
   * @param modal Optional parameter used in case calling object has modal to use
   */
  public handleDeleteAction(plan: IPlan, emitter: EventEmitter<IPlanAction>, modal?: ModalRef) {
    if (!modal) {
      modal = this.getDeleteActionModal();
    }
    const planAction = PlanAction.DELETE;
    const modalSubscription = modal.onClose.subscribe(data => {
      const planServiceSub = this._planDataService.deletePlan(plan.planId)
        .subscribe((response) => {
          data = this._updateDataObject(data, plan.planName + ' was successfully deleted.', response);
          emitter.emit(<IPlanAction>{plan, planAction, data});
        }, error => {
          emitter.emit(<IPlanAction>{plan, planAction, error, data});
        }, () => {
          if (planServiceSub) {
            planServiceSub.unsubscribe();
          }
          if (modalSubscription) {
            modalSubscription.unsubscribe();
          }
        });
    });
  }

  //#endregion

  //#region Cancel
  /**
   * Method used to get Cancel ModalRef
   */
  public getCancelActionModal(): ModalRef {
    return this._launchModalWindow('Cancel Plan',
      'Are you sure you want to cancel this plan?', 'Dismiss', 'Cancel Plan', 'Repeals a plan back to the effective date.');
  }

  /**
   * Method used to handle the Cancel action on a given plan
   * @param plan Plan used to Cancel
   * @param {EventEmitter<IPlanAction>} emitter Emitter used to send information back to consumers
   * @param modal Optional parameter used in case calling object has modal to use
   */
  public handleCancelModalAction(plan: IPlan, emitter: EventEmitter<IPlanAction>, modal?: ModalRef): void {
    if (!modal) {
      modal = this.getCancelActionModal();
    }
    const planAction = PlanAction.CANCEL;
    const modalSubscription = modal.onClose.subscribe(data => {
      const planServiceSub = this._planDataService.cancelPlan(plan.planId)
        .subscribe((response) => {
          data = this._updateDataObject(data, plan.planName + ' was successfully cancelled.', response);
          emitter.emit(<IPlanAction>{plan, planAction, data});
        }, error => {
          emitter.emit(<IPlanAction>{plan, planAction, error, data});
          Observable.throw(error);
        }, () => {
          if (planServiceSub) {
            planServiceSub.unsubscribe();
          }
          if (modalSubscription) {
            modalSubscription.unsubscribe();
          }
        });
    });
  }

  //#endregion

  //#region Terminate
  /**
   * Method used to get Terminate ModalRef
   */
  public getTerminateActionModal(): ModalRef {
    let componentType: Type<Component> = PlanTerminateComponent as Type<Component>;
    let inputs: Map<string, any> = new Map<string, any>();
    return this._modalService.open(componentType, {
      backdrop: true,
      size: 'sm',
      closeOnEsc: true,
      inputs: inputs,
      containerClass: 'plan-terminate-container'
    });
  }

  /**
   * Method used to handle the Terminate action on a given plan
   * @param plan Plan used to Terminate
   * @param {EventEmitter<IPlanAction>} emitter Emitter used to send information back to consumers
   * @param modal Optional parameter used incase calling object has modal to use
   */
  public handleTerminateAction(plan: IPlan, emitter: EventEmitter<IPlanAction>, modal?: ModalRef) {
    if (!modal) {
      modal = this.getTerminateActionModal();
    }
    const planAction = PlanAction.TERMINATE;
    const modalSubscription = modal.onClose.subscribe(data => {
      if (isNil(data)) {
        emitter.emit(<IPlanAction>{plan, planAction, error: 'Termination Date was not provided'});
        if (modalSubscription) {
          modalSubscription.unsubscribe();
        }
      } else {
        const planServiceSub = this._planDataService.terminatePlan(plan.planId, data.terminationDate)
          .subscribe((response) => {
            data = this._updateDataObject(data, plan.planName + ' was successfully terminated.', response);
            emitter.emit(<IPlanAction>{plan, planAction, data});
          }, error => {
            emitter.emit(<IPlanAction>{plan, planAction, error, data});
            Observable.throw(error);
          }, () => {
            if (planServiceSub) {
              planServiceSub.unsubscribe();
            }
            if (modalSubscription) {
              modalSubscription.unsubscribe();
            }
          });
      }
    });
  }

  //#endregion

  //#region Export
  /**
   * Method used to get Export ModalRef
   */
  public getExportActionModal(): ModalRef {
    return this._launchModalWindow('Export Plan',
      'Are you sure you want to Export this plan?',
      'Dismiss', 'Export Plan', 'Produces a printable view of all plan detail.');
  }

  /**
   * Method used to handle the Export action on a given plan
   * @param plan Plan used to Export
   * @param {EventEmitter<IPlanAction>} emitter Emitter used to send information back to consumers
   * @param modal Optional parameter used incase calling object has modal to use
   */
  public handleExportAction(plan: IPlan, emitter: EventEmitter<IPlanAction>, modal?: ModalRef): void {
    let data: any = null;
    const planAction = PlanAction.EXPORT_DATA_DETAIL;
    const exportServiceSub = this._planDataService.exportPlan(plan)
      .subscribe((response) => {
        DownloadHelper.downloadFile(response.body, `plan-${plan.planId}.pdf`);
        data = this._updateDataObject(data, plan.planName + ' was successfully exported to pdf.', response);
        emitter.emit(<IPlanAction>{plan, planAction, data});
      }, error => {
        emitter.emit(<IPlanAction>{plan, planAction, error, data});
        Observable.throw(error);
      }, () => {
        if (exportServiceSub) {
          exportServiceSub.unsubscribe();
        }
      });
  }

  //#endregion

  //#region Export Comments
  /**
   * Method used to get Export Comments ModalRef
   */
  public getExportCommentsActionModal(): ModalRef {
    return this._launchModalWindow('Export Comments',
      'Are you sure you want to Export the comments this plan?',
      'Dismiss', 'Export Plan', 'Produces a printable view of all plan comments.');
  }

  /**
   * Method used to handle the Export Comments action on a given plan
   * @param plan Plan used to Export Comments
   * @param {EventEmitter<IPlanAction>} emitter Emitter used to send information back to consumers
   * @param modal Optional parameter used incase calling object has modal to use
   */
  public handleExportCommentsAction(plan: IPlan, emitter: EventEmitter<IPlanAction>, modal?: ModalRef) {
    if (!modal) {
      modal = this.getExportCommentsActionModal();
    }
    const planAction = PlanAction.EXPORT_COMMENTS;
    const modalSubscription = modal.onClose.subscribe(data => {
      emitter.emit(<IPlanAction>{plan, planAction, data});
    });
  }

  //#endregion

  //#region Revise
  /**
   * Method used to get Revise ModalRef
   */
  public getReviseActionModal(): ModalRef {
    return this._launchModalWindow('Revise Plan',
      'Are you sure you want to Revise this plan?',
      'Dismiss', 'Revise Plan', '');
  }

  /**
   * Method used to handle the Revise action on a given plan
   * @param plan Plan used to Revise
   * @param {EventEmitter<IPlanAction>} emitter Emitter used to send information back to consumers
   * @param modal Optional parameter used incase calling object has modal to use
   */
  public handleReviseAction(plan: IPlan, emitter: EventEmitter<IPlanAction>, modal?: ModalRef) {
    if (!modal) {
      modal = this.getReviseActionModal();
    }
    const planAction = PlanAction.REVISE;
    const modalSubscription = modal.onClose.subscribe(data => {
      data = this._updateDataObject(data, plan.planName + ' was successfully Revised.', null);
      emitter.emit(<IPlanAction>{plan, planAction, data});
    });
  }

  //#endregion

  //#region Retro Revise
  /**
   * Method used to get Retro Revise ModalRef
   */
  public getRetroReviseActionModal(): ModalRef {
    return this._launchModalWindow('Retro Revise Plan',
      'Are you sure you want to Retro Revise this plan?',
      'Dismiss', 'Retro Revise Plan', '');
  }

  /**
   * Method used to handle the Retro Revise action on a given plan
   * @param plan Plan used to Retro Revise
   * @param {EventEmitter<IPlanAction>} emitter Emitter used to send information back to consumers
   * @param modal Optional parameter used incase calling object has modal to use
   */
  public handleRetroReviseAction(plan: IPlan, emitter: EventEmitter<IPlanAction>, modal?: ModalRef) {
    if (!modal) {
      modal = this.getRetroReviseActionModal();
    }
    const planAction = PlanAction.RETRO_REVISE;
    const modalSubscription = modal.onClose.subscribe(data => {
      data = this._updateDataObject(data, plan.planName + ' was successfully Retro Revised.', null);
      emitter.emit(<IPlanAction>{plan, planAction, data});
    });
  }

  //#endregion

  //#region Revert
  /**
   * Method used to get Revert ModalRef
   */
  public getRevertActionModal(): ModalRef {
    return this._launchModalWindow('Revert Plan',
      'Are you sure you want to Revert this plan?',
      'Dismiss', 'Revert Plan', 'Returns a plan to prior status.');
  }

  /**
   * Method used to handle the Revert action on a given plan
   * @param plan Plan used to Revert
   * @param {EventEmitter<IPlanAction>} emitter Emitter used to send information back to consumers
   * @param modal Optional parameter used incase calling object has modal to use
   */
  public handleRevertAction(plan: IPlan, emitter: EventEmitter<IPlanAction>, modal?: ModalRef) {
    if (!modal) {
      modal = this.getRevertActionModal();
    }
    const planAction = PlanAction.REVERT;
    const modalSubscription = modal.onClose.subscribe(data => {
      data = this._updateDataObject(data, plan.planName + ' was successfully Reverted.', null);
      emitter.emit(<IPlanAction>{plan, planAction, data});
    });
  }
  //#endregion

  //#region Reinstate
  /**
   * Method used to get Reinstate ModalRef
   */
  public getReinstateActionModal(): ModalRef {
    return this._launchModalWindow('Reinstate Plan',
      'Are you sure you want to Reinstate this plan?',
      'Dismiss', 'Reinstate Plan', 'Reactivates a terminated plan.');
  }

  /**
   * Method used to handle the Reinstate action on a given plan
   * @param plan Plan used to Reinstate
   * @param {EventEmitter<IPlanAction>} emitter Emitter used to send information back to consumers
   * @param modal Optional parameter used incase calling object has modal to use
   */
  public handleReinstateAction(plan: IPlan, emitter: EventEmitter<IPlanAction>, modal?: ModalRef) {
    if (!modal) {
      modal = this.getReinstateActionModal();
    }
    const planAction = PlanAction.REINSTATE;
    const modalSubscription = modal.onClose.subscribe(data => {
      data = this._updateDataObject(data, plan.planName + ' was successfully Reinstated.', null);
      emitter.emit(<IPlanAction>{plan, planAction, data});
    });
  }
  //#endregion

  /**
   * Launches the Modal Window
   */
  private _launchModalWindow(title: string, message: string, dismissText: string, closeText: string, helpText: string): ModalRef {
    let componentType: Type<Component> = ModalDefaultComponent as Type<Component>;
    let inputs: Map<string, any> = new Map<string, any>();
    inputs.set('title', title);
    inputs.set('message', message);
    inputs.set('dismissText', dismissText);
    inputs.set('closeText', closeText);
    inputs.set('helpText', helpText);
    return this._modalService.open(componentType, {
      backdrop: true,
      size: 'sm',
      closeOnEsc: true,
      inputs: inputs
    });
  }

  /**
   * Constructs data object to be emitted after action
   */
  private _updateDataObject(data: any, message: string, response: any): any {
    if (isNil(data)) {
      return {message, response};
    }

    data.message = message;
    data.response = response;
    return data;
  }

  private _removeActionsBasedOnUserRole(actions: PlanAction[]): PlanAction[] {
    const userRoles = this._userProfile.getRoles();
    let filteredActions = this._roleAccessRestriction[AccessRoleType.SUPPORT];
    if (AccessLevelUtility.isSuperUser(userRoles)) {
      filteredActions = this._roleAccessRestriction[AccessRoleType.SUPER];
    } else if (AccessLevelUtility.isStandardUser(userRoles)) {
      filteredActions = this._roleAccessRestriction[AccessRoleType.STANDARD];
    } else if (AccessLevelUtility.isKnowledgeUser(userRoles)) {
      filteredActions = this._roleAccessRestriction[AccessRoleType.KNOWLEDGE];
    } else if (AccessLevelUtility.isReadonlyUser(userRoles)) {
      filteredActions = this._roleAccessRestriction[AccessRoleType.SUPPORT];
    }
    return actions.filter(item => filteredActions.indexOf(item) < 0);
  }
}
