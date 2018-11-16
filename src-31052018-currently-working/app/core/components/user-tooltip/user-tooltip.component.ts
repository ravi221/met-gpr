import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {IUserInfo} from 'app/customer/interfaces/iUserInfo';

/**
 * Creates a user tooltip to show information about a specific user, including name, email, and metnet id
 */
@Component({
  selector: 'gpr-user-tooltip',
  template: `
    <a gprTooltip
       [tooltipContent]="user"
       [position]="position"
       [theme]="'white'">{{userInfo?.firstName}} {{userInfo?.lastName}}
    </a>
    <gpr-tooltip-content #user>
      <div class="user-info">
        <i class="material-icons user-icon">person</i>
        <div>
          <span class="user-name">{{userInfo?.firstName}} {{userInfo?.lastName}}</span>
          <span class="user-metnet">{{userInfo?.metnetId}}</span>
          <a class="user-email" [href]="userEmailAddress">
            {{userInfo?.emailAddress}}<gpr-icon name="chat"></gpr-icon>
          </a>
        </div>
      </div>
    </gpr-tooltip-content>`,
  styleUrls: ['./user-tooltip.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserTooltipComponent implements OnInit {

  /**
   * User object to be used in display
   */
  @Input() userInfo: IUserInfo;

  /**
   * Sets the position of the user tooltip
   * @type {string}
   */
  @Input() position: 'top' | 'bottom' | 'left' | 'right' = 'right';

  /**
   * The email address for a user
   * @type {string}
   */
  public userEmailAddress: string = '';

  /**
   * The default constructor.
   */
  constructor() {
  }

  /**
   * On init, setup the user information
   */
  ngOnInit(): void {
    this.userEmailAddress = `mailto:${this.userInfo.emailAddress}`;
  }
}
