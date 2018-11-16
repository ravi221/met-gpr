import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ActiveModalRef} from '../../../ui-controls/classes/modal-references';
import {LogoutService} from '../../services/logout.service';
import {Subscription} from 'rxjs/Subscription';

/**
 * The LogoutConfirmPopupComponent is used for handling user confirmation before logging out
 */
@Component({
  selector: 'gpr-logout',
  template: `
    <div>
      <p>{{question}}</p>
      <p>{{logoutCountdownText}}</p>
      <div class="modal-footer">
        <a (click)="cancel()">{{cancelLabel}}</a>
        <a (click)="confirm()">{{confirmLabel}}</a>
      </div>
    </div>
  `,
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit, OnDestroy {

  /**
   * Question for the dialog
   */
  @Input() question: string;

  /**
   * Confirm action text
   */
  @Input() confirmLabel: string;

  /**
   * Cancel action text
   */
  @Input() cancelLabel: string;

  /**
   * countdown for the dialog
   */
  public logoutCountdownText: string;

  /**
   *  The subscription for when the modal opens.
   */
  private _idleSubscription: Subscription;

  /**
   * Constructor for LogoutConfirmPopupCmponent
   * @param {ActiveModalRef} _activeModalRef: Allows user to handle closing and opening the modal
   * @param {LogoutService} _logoutService : Allows user to invoke logout action.
   */
  constructor(private _activeModalRef: ActiveModalRef,
              private _logoutService: LogoutService) {
  }

  /**
   * On init, subscribe to the idle  state
   */
  ngOnInit(): void {
    this._idleSubscription = this._logoutService.onIdleWarning.subscribe((e) => this.onIdleWarning(e));
  }

  /**
   * On destroy, unsubscribe from the idle state
   */
  ngOnDestroy(): void {
    if (this._idleSubscription) {
      this._idleSubscription.unsubscribe();
    }
  }

  /**
   * Handles the confirm event of the close link.
   */
  public confirm(): void {
    this._activeModalRef.close();
    this._logoutService.logoutUser();
  }

  /**
   * Handles the cancel event of the dismiss link.
   */
  public cancel(): void {
    this._activeModalRef.close();
  }

  /**
   * Update inactive countdown in the dialog
   * @param {number} numberOfSeconds
   */
  public onIdleWarning(numberOfSeconds: number): void {
    this.logoutCountdownText = `Inactive user session will be automatically logged out in ${numberOfSeconds} seconds`;
  }
}
