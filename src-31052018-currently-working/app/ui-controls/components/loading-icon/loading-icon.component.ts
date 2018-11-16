import {Component, Input} from '@angular/core';

/**
 * A loading icon
 */
@Component({
  selector: 'gpr-loading-icon',
  template: `
    <div class="loading-bar" [hidden]="!show">
      <div class="rect1"></div>
      <div class="rect2"></div>
      <div class="rect3"></div>
      <div class="rect4"></div>
      <div class="rect5"></div>
    </div>
  `,
  styleUrls: ['./loading-icon.component.scss']
})
export class LoadingIconComponent {

  /**
   * Indicates if to show the loading icon
   * @type {boolean}
   */
  @Input() show: boolean = true;

  /**
   * The default constructor
   */
  constructor() {
  }
}
