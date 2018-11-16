import {Component, Input} from '@angular/core';
import { IFlagsRequest } from '../../../flag/interfaces/iFlagsRequest';
import { IFlag } from 'app/flag/interfaces/iFlag';

@Component({
  selector: 'gpr-flag-create-tooltip',
  template: ``
})
export class FlagCreateTooltipStubComponent {
  /**
   * The position where to place the tooltip
   */
  @Input() position: string = 'left';

  /**
   * request bod for post to create the flag, contains data from parent
   */
  @Input() tagData: IFlagsRequest;

  /**
   * is there a flag already on this object
   */
  @Input() questionFlag: IFlag;
}
