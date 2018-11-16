import {Component, Input} from '@angular/core';
import {IHistoricalVersion} from '../../interfaces/iHistoricalVersion';

/**
 * A stub component for {@link HistoricalVersionListComponent}
 */
@Component({selector: 'gpr-historical-version-list', template: ``})
export class HistoricalVersionListStubComponent {
  @Input() historicalVersions: IHistoricalVersion[] = [];

}
