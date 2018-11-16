import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {AnimationState} from '../../animations/AnimationState';
import {fadeInOutLoadingSpinner} from '../../animations/fade-in-out';

/**
 * A loading spinner used to display when something is loading in the application
 */
@Component({
  selector: 'gpr-loading-spinner',
  template: `
    <div class="loading-spinner-container" [@fadeInOutLoadingSpinner]="state">
      <div class="loading-spinner">
        <div class="circle circle-1"></div>
        <div class="circle circle-2"></div>
        <div class="circle circle-3"></div>
      </div>
    </div>
  `,
  animations: [fadeInOutLoadingSpinner],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoadingSpinnerComponent {
  /**
   * Indicates if to show the loading spinner
   * @type {boolean}
   */
  @Input() state: AnimationState = AnimationState.HIDDEN;
}
