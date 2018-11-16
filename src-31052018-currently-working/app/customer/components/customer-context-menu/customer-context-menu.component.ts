import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {IHomeAction} from 'app/customer/interfaces/iHomeActions';
import {ICustomer} from 'app/customer/interfaces/iCustomer';
import {TooltipService} from '../../../ui-controls/services/tooltip.service';

/**
 * This component is used on to show additional actions to perform on a customer
 */
@Component({
  selector: 'gpr-customer-context-menu',
  template: `
    <gpr-icon class="customer-context-menu-icon"
              [name]="'context-menu'"
              gprTooltip
              [position]="'bottom'"
              [theme]="'white'"
              [displayCloseIcon]="false"
              [tooltipContent]="homeActionContent">
    </gpr-icon>
    <gpr-tooltip-content #homeActionContent>
      <section class="tooltip-menu">
        <ul class="tooltip-options-list">
          <li *ngFor="let homeAction of homeActions">
            <a (click)="homeAction.action()">{{homeAction.label}}</a>
          </li>
        </ul>
      </section>
    </gpr-tooltip-content>
  `,
  styleUrls: ['./customer-context-menu.component.scss']
})
export class CustomerContextMenuComponent implements OnInit {

  /**
   * The customer object that is used to display information.
   */
  @Input() customer: ICustomer;

  /**
   * Event emitter for when tooltip customer visibility action is clicked.
   * @type {EventEmitter<ICustomer>}
   */
  @Output() customerHide: EventEmitter<ICustomer> = new EventEmitter<ICustomer>();

  /**
   * A list of customer home actions to perform on a customer
   */
  public homeActions: IHomeAction[] = [];

  /**
   * Creates the customer context menu component
   * @param {TooltipService} _tooltipService
   */
  constructor(private _tooltipService: TooltipService) {
  }

  /**
   * On init, setup actions for toggling showing and hiding customers on UI
   */
  ngOnInit(): void {
    this.homeActions = [<IHomeAction>{
      label: this.customer.hiddenStatus ? 'Unhide Customer' : 'Hide Customer',
      action: this.changeCustomerVisibility.bind(this)
    }];
  }

  /**
   * Handles the click event of the Customers Visibility tooltip button on the customer card.
   */
  public changeCustomerVisibility(): void {
    this.customer.hiddenStatus = !this.customer.hiddenStatus;
    this.customerHide.emit(this.customer);
    this._closeTooltipMenu();
  }

  /**
   * Closes the tooltip menu
   */
  private _closeTooltipMenu(): void {
    this._tooltipService.hideAllTooltips();
  }
}
