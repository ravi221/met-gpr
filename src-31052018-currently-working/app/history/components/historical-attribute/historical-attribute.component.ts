import {Component, Input} from '@angular/core';
import {IHistoricalAttribute} from '../../interfaces/iHistoricalAttribute';

/**
 * Represents a single historical attribute
 */
@Component({
  selector: 'gpr-historical-attribute',
  template: `
    <div class="section historical-attribute">
      <div class="attribute" *ngFor="let attribute of historicalAttributes">
        <gpr-historical-attribute-item [attribute]="attribute"></gpr-historical-attribute-item>
      </div>
    </div>
  `,
  styleUrls: ['./historical-attribute.component.scss']
})
export class HistoricalAttributeComponent {

  /**
   * A historical attribute to be displayed
   */
  @Input() historicalAttributes: IHistoricalAttribute[] = [];
}
