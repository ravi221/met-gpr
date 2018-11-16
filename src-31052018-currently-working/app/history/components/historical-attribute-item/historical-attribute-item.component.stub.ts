import {Component, Input} from '@angular/core';
import {IHistoricalAttribute} from '../../interfaces/iHistoricalAttribute';

/**
 * A stub component for {@link HistoricalAttributeItemComponent}
 */
@Component({
  selector: 'gpr-historical-attribute-item', template: ``
})
export class HistoricalAttributeItemStubComponent {
  @Input() attribute: IHistoricalAttribute;
}
