import {Component, EventEmitter, Output} from '@angular/core';
import {ISearchUser} from '../../interfaces/iSearchUser';

/**
 * A stub component for {@link SearchUserBarComponent}
 */
@Component({selector: 'gpr-search-user-bar', template: ``})
export class SearchUserBarStubComponent {
  @Output() userSelect: EventEmitter<ISearchUser> = new EventEmitter<ISearchUser>();
}
