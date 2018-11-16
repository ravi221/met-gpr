import {Component, EventEmitter, OnDestroy, OnInit, Output, HostListener} from '@angular/core';
import {NavigatorService} from '../services/navigator.service';
import {INavState} from '../interfaces/iNavState';
import {ICustomer} from '../../customer/interfaces/iCustomer';
import {NavContextType} from '../enums/nav-context';

/**
 * The contents of the main navigation menu.  This outermost component
 * is responsible only for (1) displaying the close button at the top,
 * and (2) managing the context and switching in/out the correct view
 * based on that context.
 *
 * Any other responsibilities should be handled either by its containing
 * component or by the more specific, contextual nav menu components.
 */
@Component({
  selector: 'gpr-main-nav-menu',
  template: `
    <section class="main-nav-menu">
      <gpr-build-version></gpr-build-version>
      <div class="main-nav-close">
        <gpr-icon [name]="'main-menu-close'" *ngIf="context !== navContextTypes.CUSTOMER"
                  (click)="closeNavMenu()"></gpr-icon>
        <gpr-icon [name]="'main-menu-back'" *ngIf="context === navContextTypes.CUSTOMER"
                  (click)="goToDefaultContext()"></gpr-icon>
      </div>
      <div class="clearfix"></div>
      <gpr-customers-nav-menu *ngIf="context === navContextTypes.DEFAULT"
        (customerSelect)="goToCustomerContext($event)">
      </gpr-customers-nav-menu>

      <gpr-plans-nav-menu *ngIf="context === navContextTypes.CUSTOMER" [customer]="customer">
      </gpr-plans-nav-menu>
    </section>
  `,
  styleUrls: ['./main-nav-menu.component.scss']
})
export class MainNavMenuComponent implements OnInit, OnDestroy {
  /**
   * Since templates cannot access objects that are not exposed by the
   component class, we have to assign the nav context enum to a property so we can reference it in the template.
   */
  navContextTypes = NavContextType;

  /**
   * A string representing the context for which the menu should
   * be displayed; if we are in a customer-specific context then
   * we will show the plan-list nav menu.  Otherwise we will show
   * the customer-list nav menu.
   */
  context: NavContextType;

  /**
   * A customer which will be passed into the plans nav menu if
   * we are not in a customer-specific nav state
   */
  customer: ICustomer;

  /**
   * Close the container in which the nav menu is displayed
   * @type {EventEmitter<any>}
   */
  @Output() close: EventEmitter<any> = new EventEmitter();

  /**
   * Creates the main nav menu component
   * @param {NavigatorService} _navigator
   */
  constructor(private _navigator: NavigatorService) {
  }

  /**
   * On init, subscribe to any navigation state changes
   */
  ngOnInit() {
    const navState = this._navigator.subscribe('main-nav', (value: INavState) => {
      this.context = value.context;
      this.closeNavMenu();
    });
    this.context = navState.context;
  }

  /**
   * On destroy, unsubscribe from the navigation state
   */
  ngOnDestroy() {
    this._navigator.unsubscribe('main-nav');
  }

  /**
   * Emits a close event to be handled by the containing component.  Note
   * that this does not actually close anything; this component is agnostic
   * regarding what kind of container it's in, so it is the container's
   * responsibility to know how to close itself.
   */
  closeNavMenu() {
    this.close.emit();
  }

  /**
   * When the user clicks on a customer row, we should show the plans for that customer.
   */
  goToCustomerContext(customer: ICustomer) {
    this.customer = customer;
    this.context = NavContextType.CUSTOMER;
  }

  /**
   * When the user clicks 'back' from the plans menu, we should show the customers menu.
   */
  goToDefaultContext() {
    this.customer = null;
    this.context = NavContextType.DEFAULT;
  }

}
