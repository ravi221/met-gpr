import {Component, OnDestroy, OnInit} from '@angular/core';
import {isNil} from 'lodash';
import {BuildVersionService} from '../../services/build-version.service';
import {Subscription} from 'rxjs/Subscription';

/**
 * A component to display the build version from TFS
 */
@Component({
  selector: 'gpr-build-version',
  template: `
    <aside *ngIf="showBuildVersion" class="build-version">
      <label class="build-label">build</label>
      <span class="build-value">{{buildVersion}}</span>
    </aside>`,
  styleUrls: ['./build-version.component.scss']
})
export class BuildVersionComponent implements OnInit, OnDestroy {
  /**
   * The current build version
   * @type {string}
   */
  public buildVersion: string = '';

  /**
   * Indicates if to show the build version
   * @type {boolean}
   */
  public showBuildVersion: boolean = false;

  /**
   * A subscription to get the build version
   */
  private _buildVersionSubscription: Subscription;

  /**
   * Creates the build version component
   * @param {BuildVersionService} _buildVersionService
   */
  constructor(private _buildVersionService: BuildVersionService) {
  }

  /**
   * On init, check to show the build version
   */
  ngOnInit(): void {
    this._getBuildVersion();
  }

  /**
   * On destroy, unsubscribe from description to get build version
   */
  ngOnDestroy(): void {
    if (this._buildVersionSubscription) {
      this._buildVersionSubscription.unsubscribe();
    }
  }

  /**
   * Updates the build version
   * @private
   */
  private _getBuildVersion(): void {
    this._buildVersionSubscription = this._buildVersionService.getBuildVersion().subscribe(buildVersion => {
      this.buildVersion = buildVersion;
      this.showBuildVersion = this._showBuildVersion(buildVersion);
      if (this._buildVersionSubscription) {
        this._buildVersionSubscription.unsubscribe();
      }
    });
  }

  /**
   * Gets whether to show the build version
   * @param {string} buildVersion
   * @returns {boolean}
   * @private
   */
  private _showBuildVersion(buildVersion: string): boolean {
    if (isNil(buildVersion)) {
      return false;
    }
    return buildVersion.length > 0;
  }
}
