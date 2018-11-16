import {AfterViewInit, Component, Input, OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {ProgressService} from '../../services/progress.service';
import {IProgress} from '../../interfaces/iProgress';

/**
 * A progress bar component class that utilizes the {@link ProgressService} injectable to display a progress bar based on active async transactions.
 */
@Component({
  selector: 'gpr-progress-bar',
  template: `
    <div class="progress" [style.opacity]="opacity">
      <div [class]="mode" [style.width.%]="percentage"></div>
    </div>
  `,
  styleUrls: ['./progress-bar.component.scss']
})
export class ProgressBarComponent implements AfterViewInit, OnDestroy {

  /**
   * The mode of the progress bar, determinate if is sequential loading, indeterminate if continuous loading
   * @type {string}
   */
  @Input() mode: string = 'determinate';

  /**
   * The opacity of the progress bar
   */
  opacity: '1' | '0' = '1';

  /**
   * The percentage complete of the progress service
   * @type {number}
   */
  percentage: number = 0;

  /**
   * A subscription to the progress service
   */
  private _subscription: Subscription;

  /**
   * Creates an instance of this class and injects the progress service.
   * @param {ProgressService} _progressService
   */
  constructor(private _progressService: ProgressService) {
  }

  /**
   * On view init, subscribe to progress service to observe new progress updates.
   */
  ngAfterViewInit() {
    this._subscription = this._progressService.source.subscribe((progress: IProgress) => {
      Promise.resolve()
        .then(() => {
          this.opacity = progress.active ? '1' : '0';
          this.percentage = progress.value * 100;
        })
        .then(() => {
          if (!progress.active) {
            const timeout = setTimeout(() => {
              this.percentage = 0;
              clearTimeout(timeout);
            }, 1000);
          }
        });
    });
  }

  /**
   * On destroy, unsubscribe from progress observable.
   */
  ngOnDestroy() {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
  }
}
