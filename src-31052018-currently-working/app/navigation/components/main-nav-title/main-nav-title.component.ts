import {Component} from '@angular/core';

/**
 * A presentational component for showing the
 * title at the top of a navigation menu
 */
@Component({
  selector: 'gpr-main-nav-title',
  template: `
    <div class="main-nav-title">
      <ng-content></ng-content>
    </div>`,
  styleUrls: ['./main-nav-title.component.scss']
})
export class MainNavTitleComponent {
}
