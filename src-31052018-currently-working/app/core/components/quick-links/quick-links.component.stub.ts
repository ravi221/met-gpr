import {Component, Input} from '@angular/core';
import {IQuickLink} from '../../interfaces/iQuickLink';

/**
 * A stub component for {@link QuickLinksComponent}
 */
@Component({selector: 'gpr-quick-links', template: ``})
export class QuickLinksStubComponent {
  @Input() quickLinks: IQuickLink[] = [];
}
