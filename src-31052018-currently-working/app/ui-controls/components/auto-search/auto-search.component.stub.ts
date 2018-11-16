import {Observable} from 'rxjs/Observable';
import {Component, Input} from '@angular/core';
import {IAutoSearchResultItem} from '../../interfaces/iAutoSearchResultItem';

/**
 * Stub of {@link AutoSearchComponent}
 */
@Component({selector: 'gpr-auto-search', template: ``})
export class AutoSearchStubComponent {
  @Input() placeholderText: string = '';
  @Input() getRemoteData: (data: string) => Observable<any>;
  @Input() formatDataFunction: (data: any) => Array<IAutoSearchResultItem>;
  @Input() isAsync: boolean = true;
  @Input() minSearchLength: number = 2;
}
