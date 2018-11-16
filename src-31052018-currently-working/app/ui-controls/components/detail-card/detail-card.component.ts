import {ChangeDetectionStrategy, Component, Input} from '@angular/core';

/**
 * A detail card which standardizes a common heading, with any content for the body
 */
@Component({
  selector: 'gpr-detail-card',
  template: `
    <gpr-card>
      <header class="detail-header">
        <h1 class="detail-heading">{{heading}}</h1>
        <div class="detail-heading-info">
          <span *ngIf="showHeadingCount" class="detail-heading-count">{{headingCount}}</span>
          <gpr-icon *ngIf="headingIcon" [name]="headingIcon"></gpr-icon>
        </div>
      </header>
      <main class="detail-content">
        <ng-content></ng-content>
      </main>
    </gpr-card>
  `,
  styleUrls: ['./detail-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DetailCardComponent {
  /**
   * The detail heading
   * @type {string}
   */
  @Input() heading: string = '';

  /**
   * The icon to display opposite the heading
   * @type {string}
   */
  @Input() headingIcon: string = '';

  /**
   * A value to display next to the heading icon
   * @type {string}
   */
  @Input() headingCount: number = 0;

  /**
   * Indicates if to display the heading count
   * @type {boolean}
   */
  @Input() showHeadingCount: boolean = false;
}
