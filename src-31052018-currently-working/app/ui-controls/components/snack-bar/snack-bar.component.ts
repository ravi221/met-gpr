import {Component, OnDestroy, OnChanges, Input, SimpleChanges} from '@angular/core';

/**
 * Creates a custom snack bar at the bottom of the screen
 *
 * Usage:
 * ```html
 *    <gpr-snack-bar [autoHide]="false" [show]="true"></gpr-snack-bar>
 * ```
 */
@Component({
  selector: 'gpr-snack-bar',
  template: `
    <div class="snack-bar" [hidden]="!show">
      <ng-content></ng-content>
    </div>
  `,
  styleUrls: ['./snack-bar.component.scss']
})
export class SnackBarComponent implements OnDestroy, OnChanges {

  /**
   * Indicates if to show the snack bar
   * @type {boolean}
   */
  @Input() show = false;

  /**
   * Indicates if to automatically hide the snack bar
   * @type {boolean}
   */
  @Input() autoHide = true;

  /**
   * A timeout id, used to time when the snack bar opens
   */
  private _timeoutId: any;

  /**
   * Creates the snack bar component
   */
  constructor() {
  }

  /**
   * On changes, update if to show the snack bar
   * @param {SimpleChanges} changes
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes.show) {
      if (changes.show.currentValue) {
        this._hideSnackBar();
      }
    }
  }

  /**
   * On destroy, clear the timeout
   */
  ngOnDestroy() {
    clearTimeout(this._timeoutId);
  }

  /**
   * Hides the snack bar
   */
  private _hideSnackBar() {
    if (this.autoHide) {
      clearTimeout(this._timeoutId);
      this._timeoutId = setTimeout(() => {
        this.show = false;
        clearTimeout(this._timeoutId);
      }, 5000);
    }
  }
}
