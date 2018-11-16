import {Component, Input} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {ActiveModalRef} from '../../../classes/modal-references';
import {LoadingSpinnerService} from '../../../services/loading-spinner.service';

/**
 * Modal for confirming actions.
 * Takes in a message to display, text for the confirmation of the action, text for cancelling the action, a function to perform, optional arguments for that function, and an optional Subject
 * The subject exists to allow for asynchronous operations. In those cases the dialogue will only be closed after next is called on the subject. This should be done after the async call
 * finishes.
 */
@Component({
  selector: `gpr-confirm-dialogue`,
  template: `
    <div>
      <div class="modal-body">
        <p>{{message}}</p>
      </div>
      <div class="modal-footer">
        <a (click)="handleConfirm()">{{confirmText}}</a>
        <a (click)="handleCancel()">{{cancelText}}</a>
      </div>
    </div>`,
  styleUrls: ['../modal.scss']
})
export class ConfirmDialogComponent {

  /**
   * The primary text of the modal
   */
  @Input() message: string;

  /**
   * The text indicating you want to perform an action
   */
  @Input() confirmText: string = 'Yes';

  /**
   * The text indicating you do not want to perform an action
   */
  @Input() cancelText: string = 'No';

  /**
   * The action to perform
   */
  @Input() action: Function;

  /**
   * Indicates if a function is asynchronous
   */
  @Input() isAsync?: boolean = false;
  /**
   * Any arguments needed to call the function. This needs to be an 'any' as the arguments could be of any type.
   * @type {any[]}
   */
  @Input() args?: any[] = [];

  /**
   * A subscription for the subject. Only needed for async operations
   */
  private _subscription: Subscription;

  /**
   * get a reference to a modal
   * @param {ActiveModalRef} _activeModalRef
   */
  constructor(private _activeModalRef: ActiveModalRef, private _spinnerService: LoadingSpinnerService) {}

  /**
   * Performs the passed in function
   */
  public handleConfirm(): void {
    if (this.isAsync) {
      this._subscription = this.action.apply(null, this.args).subscribe( () => {
        this._spinnerService.hide();
        return this._activeModalRef.close(true);
      });
      this._spinnerService.show();
    } else {
      this.action.apply(null, this.args);
      return this._activeModalRef.close(true);
    }
  }

  /**
   * Closes the modal
   */
  public handleCancel(): void {
    this._activeModalRef.close(true);
  }
}
