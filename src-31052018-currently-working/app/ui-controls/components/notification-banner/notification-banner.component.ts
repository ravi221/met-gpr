import {ChangeDetectionStrategy, Component, HostListener, Input, OnChanges} from '@angular/core';
import {INotification} from '../../../core/interfaces/iNotification';
import {AnimationState} from '../../animations/AnimationState';
import {slideInOut} from '../../animations/slide-in-out';
import {isNil} from 'lodash';

/**
 * A notification banner to display any notification such as an error or successful call
 */
@Component({
  selector: 'gpr-notification-banner',
  template: `
    <header [className]="styleClass" [@slideInOut]="state">
      <span class="notification-icon"><gpr-icon [name]="notificationIcon"></gpr-icon></span>
      <h3 class="notification-heading">{{notificationMessage}}</h3>
      <span class="notification-close"><gpr-icon [name]="'banner-close'"></gpr-icon></span>
    </header>
  `,
  styleUrls: ['./notification-banner.component.scss'],
  animations: [slideInOut],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotificationBannerComponent implements OnChanges {

  /**
   * The notification to display
   */
  @Input() notification: INotification;

  /**
   * The current state of the animation to show/hide the banner
   */
  public state: AnimationState = AnimationState.HIDDEN;

  /**
   * The notification message to display
   */
  public notificationMessage: string = '';

  /**
   * The icon to show depending on the notification type
   */
  public notificationIcon: string = '';

  /**
   * The class for styling purposes
   */
  public styleClass: string = 'notification-banner';

  /**
   * The default constructor.
   */
  constructor() {
  }

  /**
   * On changes, update the banner based on the notification
   */
  ngOnChanges(): void {
    let showBanner = false;
    if (!isNil(this.notification)) {
      this.notificationMessage = this.notification.message;
      const notificationType = this.notification.type;
      this.styleClass = `notification-banner ${notificationType}`;
      this.notificationIcon = `banner-${notificationType}`;
      showBanner = true;
    }
    this.showBanner(showBanner);
  }

  /**
   * Indicates if to show the banner
   * @param {boolean} showBanner
   */
  public showBanner(showBanner: boolean): void {
    this.state = showBanner ? AnimationState.VISIBLE : AnimationState.HIDDEN;
  }

  /**
   * Toggles the banner visibility on click event
   */
  @HostListener('document:click', [])
  public onClick(): void {
    this.showBanner(false);
  }
}
