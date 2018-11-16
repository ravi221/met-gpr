import {Component, EventEmitter, Input, OnDestroy, Output, Type} from '@angular/core';
import {ModalService} from '../../../ui-controls/services/modal.service';
import {FlagResolverPopupComponent} from '../flag-resolver-popup/flag-resolver-popup.component';
import {Subscription} from 'rxjs/Subscription';
import {ModalRef} from '../../../ui-controls/classes/modal-references';
import {ICustomer} from '../../../customer/interfaces/iCustomer';
import { IFlag } from 'app/flag/interfaces/iFlag';

/**
 * A tooltip used to resolve or retain a flag
 */
@Component({
  selector: 'gpr-flag-resolver-tooltip',
  template: `
    <gpr-tooltip-content #flagTooltip>
      <aside class="plrbt-15 tooltip-container">
        <header>
          <gpr-icon (click)="onFlagResolve(flag)" class="resolver-img" name="check-off"></gpr-icon>
          <span class="resolve-flag-text">&nbsp;Resolve Flag</span>
        </header>
        <div class="mt-16">
          <span class="created-date">{{flag.lastUpdatedTimestamp}}</span><br>
          <span class="created-by">{{flag.lastUpdatedBy}}</span>
          <p class="tag-text">{{flag.text}}</p>
        </div>
      </aside>
    </gpr-tooltip-content>
    <gpr-icon gprTooltip [tooltipContent]="flagTooltip"
              [position]="position"
              [theme]="'white'"
              [displayCloseIcon]="false" name="flag"></gpr-icon>
  `,
  styleUrls: ['./flag-resolver-tooltip.component.scss']
})
export class FlagResolverTooltipComponent implements OnDestroy {

  /**
   * Determines the position of the tooltip
   */
  @Input() position: string = 'left';

  /**
   * The tag that needs to be resolved
   */
  @Input() flag: IFlag;

  /**
   * The customer associated with a card
   */
  @Input() customer: ICustomer;

  /**
   * Notifies parent component of resolve event
   * @type {EventEmitter<IContextTag>}
   */
  @Output() flagResolveEmit: EventEmitter<IFlag> = new EventEmitter<IFlag>();

  /**
   * A reference to the Modal that pops up when flags are resolved
   */
  public modalRef: ModalRef;

  /**
   *  The subscription for when the modal opens.
   */
  private _modalSubscription: Subscription;

  /**
   * Basic constructor for flag resolver
   * @param {ModalService} _modalService
   */
  constructor(private _modalService: ModalService) {
  }

  /**
   * On destroy, unsubscribe from the modal subscription
   */
  ngOnDestroy(): void {
    if (this._modalSubscription) {
      this._modalSubscription.unsubscribe();
    }
  }


  /**
   * Handles resolve events and notifies parent component.
   * @param {IContextTag} flag
   */
  onFlagResolve(flag: IFlag) {
    let componentType: Type<Component> = FlagResolverPopupComponent as Type<Component>;
    let inputs: Map<string, any> = new Map<string, any>();
    inputs.set('customer', this.customer);
    inputs.set('flag', flag);
    this.modalRef = this._modalService.open(componentType, {
      backdrop: true,
      size: 'sm',
      closeOnEsc: true,
      inputs: inputs,
      containerClass: 'flag-resolver-popup-container'
    });
    this._modalSubscription = this.modalRef.onClose.subscribe();
  }
}
