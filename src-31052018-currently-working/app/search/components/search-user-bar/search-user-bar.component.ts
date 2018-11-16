import {AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Output, ViewChild} from '@angular/core';
import {ISearchUser} from '../../interfaces/iSearchUser';
import {UserSearchService} from '../../services/user-search.service';
import {isNil} from 'lodash';

/**
 * A component to search by user, using the auto search
 */
@Component({
  selector: 'gpr-search-user-bar',
  template: `
    <div class="search-user-bar">
      <gpr-auto-search [minSearchLength]="2"
                       [getRemoteData]="getUserData"
                       [formatDataFunction]="userFormatter"
                       (onItemSelected)="onUserSelect($event)"></gpr-auto-search>
    </div>
  `,
  styleUrls: ['./search-user-bar.component.scss']
})
export class SearchUserBarComponent implements AfterViewInit {

  /**
   * Output event when a user has been selected
   * @type {EventEmitter<string>}
   */
  @Output() userSelect: EventEmitter<ISearchUser> = new EventEmitter<ISearchUser>();

  /**
   * A function used by the auto-search component to get the users
   * @type {any}
   */
  public getUserData: Function = this._userSearchService.searchUsers.bind(this._userSearchService);

  /**
   * A function used by the auto-search component to format the users
   * @type {any}
   */
  public userFormatter: Function = this._userSearchService.formatUsers.bind(this._userSearchService);

  /**
   * Creates the user search component
   * @param {ElementRef} _elementRef
   * @param {UserSearchService} _userSearchService
   */
  constructor(private _elementRef: ElementRef,
              private _userSearchService: UserSearchService) {
  }

  /**
   * After view init, update the size of the user search suggestions
   */
  ngAfterViewInit(): void {
    this._updateSuggestionsWidth();
  }

  /**
   * Handles when a user has been selected from the auto search drop-down
   * @param {ISearchUser} user
   */
  public onUserSelect(user: ISearchUser): void {
    this.userSelect.emit(user);
  }

  /**
   * Called when the window is resized
   */
  @HostListener('window:resize', [])
  public onWindowResize(): void {
    this._updateSuggestionsWidth();
  }

  /**
   * Updates the width of the auto search suggestions
   * @private
   */
  private _updateSuggestionsWidth(): void {
    const nativeEl = this._elementRef.nativeElement;

    const userBar = nativeEl.querySelector('.search-user-bar');
    if (isNil(userBar)) {
      return;
    }

    const suggestions = nativeEl.querySelector('.suggestions');
    if (isNil(suggestions)) {
      return;
    }

    const userBarWidth = userBar.offsetWidth;
    suggestions.style.width = `${userBarWidth - 30}px`;
  }
}
