import {ActivityService} from '../../services/activity.service';
import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {IActivity} from '../../interfaces/iActivity';
import {isNil} from 'lodash';

/**
 * Renders an activity tooltip, displaying the recent update message and the user
 * who performed it
 */
@Component({
  selector: 'gpr-activity-tooltip',
  template: `
    <span class="activity-tooltip" *ngIf="showActivity">
      <gpr-icon name="question-tooltip"
                gprTooltip
                [tooltipContent]="activityTooltip"
                [position]="'right'"
                [theme]="'white'"
                [maxWidth]="350"></gpr-icon>
      <gpr-tooltip-content #activityTooltip>
          <aside class="activity-tooltip-content">
            <span class="activity-message">{{activityMessage}}</span>
            <span class="activity-user">{{activityUser}}</span>
            <div class="activity-user-info">
              <i class="material-icons user-icon">person</i>
              <div>
                <span class="activity-user">{{activityUser}}</span>
                <span class="activity-metnet">{{activityMetnetId}}</span>
                <a class="activity-email" [href]="activityEmailAddress">
                  {{activityEmailLabel}}<gpr-icon name="chat"></gpr-icon>
                </a>
              </div>
            </div>
          </aside>
      </gpr-tooltip-content>
    </span>
    <span class="text-muted" *ngIf="!showActivity">
      -
    </span>
  `,
  styleUrls: ['./activity-tooltip.component.scss']
})
export class ActivityTooltipComponent implements OnInit, OnChanges {

  /**
   * The activity to display
   */
  @Input() activity: IActivity;

  /**
   * The email associated with the user who last updated this activity
   */
  public activityEmailAddress: string = '';

  /**
   * The email label associated with the user who last updated this activity
   */
  public activityEmailLabel: string = '';

  /**
   * The message to display based on the activity
   */
  public activityMessage: string = '';

  /**
   * The metnet id associated with the user who last updated this activity
   */
  public activityMetnetId: string = '';

  /**
   * The name of the user who last updated this activity
   */
  public activityUser: string = '';

  /**
   * Indicates if to show the activity tooltip
   */
  public showActivity: boolean = false;

  /**
   * Creates the activity tooltip
   */
  constructor(private _activityService: ActivityService) {
  }

  /**
   * On init, update the activity content
   */
  ngOnInit(): void {
    this._updateActivityContent();
  }

  /**
   * On changes, update the activity content
   */
  ngOnChanges(): void {
    this._updateActivityContent();
  }

  /**
   * Updates the template based on the activity input
   */
  private _updateActivityContent(): void {
    this.showActivity = this._hasActivity();

    if (this.showActivity) {
      this.activityMessage = this._activityService.getRecentCustomerPlanUpdateMessage(this.activity);
      this.activityUser = `${this.activity.firstName} ${this.activity.lastName}`;
      this.activityEmailAddress = `mailto:${this.activity.emailId}`;
      this.activityEmailLabel = this.activity.emailId;
      this.activityMetnetId = this.activity.metnetId;
    }
  }

  /**
   * Indicates if the activity exists and has data
   */
  private _hasActivity(): boolean {
    if (isNil(this.activity)) {
      return false;
    }

    return this.activity.metnetId !== null;
  }
}
