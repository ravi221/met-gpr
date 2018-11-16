import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {IHomeAction} from 'app/customer/interfaces/iHomeActions';
import {ICustomer} from 'app/customer/interfaces/iCustomer';
import {TooltipService} from '../../../ui-controls/services/tooltip.service';

/**
 * A stub for {@link CustomerContextMenuComponent}
 */
@Component({selector: 'gpr-customer-context-menu',template: ``})
export class CustomerContextMenuStubComponent {
  @Input() customer: ICustomer;
  @Output() customerHide: EventEmitter<ICustomer> = new EventEmitter<ICustomer>();
}
