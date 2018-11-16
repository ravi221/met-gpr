import {Component} from '@angular/core';

/**
 * The search landing page
 */
@Component({
  selector: 'gpr-search-landing',
  template: `
    <div class="search-landing">
      <gpr-search-page></gpr-search-page>
    </div>
  `,
  styles: [`.search-landing { padding: 48px 20%; }`]
})
export class SearchLandingComponent {
}
