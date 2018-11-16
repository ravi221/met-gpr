import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ICustomer} from 'app/customer/interfaces/iCustomer';
import {INavState} from 'app/navigation/interfaces/iNavState';
import {IPlanAction} from '../../interfaces/iPlanAction';
import {IPlan} from '../../plan-shared/interfaces/iPlan';
import {NavigatorService} from '../../../navigation/services/navigator.service';
import {PlanAction} from '../../enums/plan-action';
import {PlanContextMenuService} from '../../services/plan-context-menu.service';
import {TooltipService} from '../../../ui-controls/services/tooltip.service';

/**
 * Component to display the different actions a user can perform on a plan
 */
@Component({
  selector: 'gpr-plan-context-menu',
  template: `
    <gpr-icon class="plan-context-menu-icon"
              [name]="'context-menu'"
              gprTooltip
              [position]="'bottom'"
              [theme]="'white'"
              [displayCloseIcon]="false"
              [tooltipContent]="planActionContent"></gpr-icon>
    <gpr-tooltip-content #planActionContent>
      <section class="plan-context-menu tooltip-menu">
        <ul class="tooltip-options-list">
          <li *ngFor="let planAction of planActions">
            <a (click)="performPlanAction(planAction)">{{planAction}}</a>
          </li>
        </ul>
      </section>
    </gpr-tooltip-content>
  `,
  styleUrls: ['./plan-context-menu.component.scss']
})
export class PlanContextMenuComponent implements OnInit {

  /**
   * The plan to perform actions on
   */
  @Input() plan: IPlan;

  /**
   * Emits plan and action to perform once an action is clicked
   */
  @Output() planAction: EventEmitter<IPlanAction> = new EventEmitter<IPlanAction>();

  /**
   * The Current Customer
   */
  public currentCustomer: ICustomer;

  /**
   * A list of plan actions to perform the specified plan
   */
  public planActions: PlanAction[] = [];

  /**
   * Creates the plan context menu
   * @param {PlanContextMenuService} _planContextMenuService
   * @param {NavigatorService} _navigator
   * @param {TooltipService} _tooltipService
   */
  constructor(private _planContextMenuService: PlanContextMenuService,
    private _navigator: NavigatorService,
    private _tooltipService: TooltipService) {
  }

  /**
   * On init, subscribes to the navigation state to update the current customer
   */
  ngOnInit(): void {
    const navState = this._navigator.getNavigationState();
    this._getCustomerFromNavState(navState);
    this.planActions = this._planContextMenuService.getPlanActions(this.plan.status);
  }

  /**
   * Triggers which plan action to perform on a given plan, then closes the tooltip
   */
  public performPlanAction(planAction: PlanAction): void {
    this._tooltipService.hideAllTooltips();
    this._planContextMenuService.performAction(this.plan, this.currentCustomer, planAction, this.planAction);
  }

  /**
   * Gets the current customer based on the navigation state
   * @param {INavState} navState
   */
  private _getCustomerFromNavState(navState: INavState): void {
    if (navState && navState.data && navState.data.customer) {
      this.currentCustomer = navState.data.customer;
    }
  }
}
