import {Component, Input, OnInit} from '@angular/core';
import {ActiveModalRef} from '../../../classes/modal-references';
import {isNil} from 'lodash';

/**
 * A component class that can be used as the default modal content class for the {@link ModalService} provider.
 */
@Component({
  template: `
    <header *ngIf="hasHeader" class="modal-header">
      <h2>{{title}}</h2>
      <div class="help-tooltip">
      <gpr-help-tooltip *ngIf="showHelpText"
        [maxWidth]="350"
        [theme]="'default'"
        [displayCloseIcon]="false">{{helpText}}
      </gpr-help-tooltip>
      </div>
    </header>
    <div class="modal-body">
      <p>{{message}}</p>
    </div>
    <div class="modal-footer">
      <a (click)="dismiss($event)">{{dismissText}}</a>
      <a (click)="close($event)">{{closeText}}</a>
    </div>
  `,
  styleUrls: ['../modal.scss']
})
export class ModalDefaultComponent implements OnInit {

  /**
   * The title to display in the body of the modal.
   * @type {string}
   */
  @Input() title: string = '';

  /**
   * The message to display in the body of the modal.
   * @type {string}
   */
  @Input() message: string = '';

  /**
   * The text of the dismiss link.
   * @type {string}
   */
  @Input() dismissText: string = 'DISMISS';

  /**
   * The text of the close link.
   * @type {string}
   */
  @Input() closeText: string = 'CONFIRM';

  /**
   * Help text to be displayed.
   * @type {string}
   */
  @Input() helpText: string = '';

  /**
   * Indicates if the modal has a header
   */
  public hasHeader: boolean;

  /**
   * Indicates if the modal has help text to display
   */
  public showHelpText: boolean;

  /**
   * Creates the default modal
   * @param {ActiveModalRef} _activeModalRef
   */
  constructor(private _activeModalRef: ActiveModalRef) {
  }

  /**
   * On init, determine if there is a title
   */
  ngOnInit() {
    this.hasHeader = this.title.length > 0;
    this.showHelpText = !isNil(this.helpText) && this.helpText.length > 0;
  }

  /**
   * Handles the close event of the close link.
   * @param e
   */
  close(e): void {
    this._activeModalRef.close();
  }

  /**
   * Handles the dismiss event of the dismiss link.
   * @param e
   */
  dismiss(e): void {
    this._activeModalRef.dismiss();
  }
}
