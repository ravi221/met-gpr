import {Component, Input, OnInit} from '@angular/core';
import {IHistoricalVersion} from '../../interfaces/iHistoricalVersion';
import {IUserInfo} from '../../../customer/interfaces/iUserInfo';

/**
 * Represents the historical version list
 */
@Component({
  selector: 'gpr-historical-version-list',
  template: `
    <div class=" section historical-version-list">
      <div *ngFor="let version of historicalVersions">
        <div class="version-info">
          <div class="version-title">
            {{version.versionName}}
          </div>
          <div class="text-muted version-details">
            <span><gpr-user-tooltip [userInfo]="version.userInfo" [position]="'bottom'"></gpr-user-tooltip></span>{{version.lastUpdatedTimestamp}}
          </div>
        </div>
        <gpr-historical-attribute [historicalAttributes]="version.historyAttributes"></gpr-historical-attribute>
      </div>
    </div>
  `,
  styleUrls: ['./historical-version-list.component.scss']
})
export class HistoricalVersionListComponent {

  /**
   * A historical versions to be displayed
   */
  @Input() historicalVersions: IHistoricalVersion[] = [];

}
