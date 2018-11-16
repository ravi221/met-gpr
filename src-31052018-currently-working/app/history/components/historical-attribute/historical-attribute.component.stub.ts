import {Component, Input} from '@angular/core';
import {IHistoricalAttribute} from '../../interfaces/iHistoricalAttribute';

/**
 * A stub component for {@link HistoricalAttributeComponent}
 */
@Component({
  selector: 'gpr-historical-attribute', template: ``})
export class HistoricalAttributeStubComponent {
  @Input() historicalAttributes: IHistoricalAttribute[] = [];
}
