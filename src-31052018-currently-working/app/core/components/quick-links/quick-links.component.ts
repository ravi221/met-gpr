import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {IQuickLink} from '../../interfaces/iQuickLink';
import {NavigatorService} from 'app/navigation/services/navigator.service';

/**
 * A quick links component to show links on the {@link CustomerLandingComponent} and {@link PlanLandingComponent}
 *
 * Usage:
 * ```html
 *    <gpr-quick-links [quickLinks]="quickLinks"></gpr-customer-landing-quick-links>
 * ```
 */
@Component({
  selector: 'gpr-quick-links',
  template: `
    <gpr-detail-card [heading]="'Quick Links'">
      <ul class="quick-links-list">
        <li *ngFor="let quickLink of quickLinks" class="quick-link" (click)="navigateToUrl(quickLink.url)">
          <i class="material-icons">description</i>
          <span>{{quickLink.label}}</span>
        </li>
      </ul>
    </gpr-detail-card>
  `,
  styleUrls: ['./quick-links.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QuickLinksComponent {
  /**
   * A list of quick links to display
   */
  @Input() quickLinks: IQuickLink[] = [];

  /**
   * Creates the quick links component
   * @param {NavigatorService} _navigator
   */
  constructor(private _navigator: NavigatorService) {
  }

  /**
   * Navigates to a quick link's url
   * @param {string} url
   */
  public navigateToUrl(url: string): void {
    this._navigator.goToUrl(url);
  }
}
