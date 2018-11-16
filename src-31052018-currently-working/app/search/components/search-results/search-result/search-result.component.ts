import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

/**
 * Creates a generic search result component to display an icon, title, and subtitle
 *
 * Usage:
 * ```html
 *  <gpr-search-result [icon]="icon"
 *                     [title]="title"
 *                     [subtitle]="subtitle"
 *                     [moreInfoLabel]="moreInfoLabel"></gpr-search-result>
 * ```
 */
@Component({
  selector: 'gpr-search-result',
  template: `
    <div class="search-result"
         (click)="onSearchResultClick()"
         (mouseenter)="onMouseEnter()"
         (mouseleave)="onMouseLeave()">
      <gpr-icon [name]="icon" [iconSize]="'large'" [state]="hoverState"></gpr-icon>
      <div class="search-result-info">
        <gpr-search-result-title [title]="title"></gpr-search-result-title>
        <h3 class="search-result-subtitle">{{subtitle}}</h3>
      </div>
      <button *ngIf="showMoreInfoButton"
              class="btn btn-more-info search-result-more-info"
              (click)="onMoreInfoClick()">{{moreInfoLabel}}
      </button>
    </div>
  `,
  styleUrls: ['./search-result.component.scss']
})
export class SearchResultComponent implements OnInit {

  /**
   * The search result icon
   */
  @Input() icon: string;

  /**
   * The search result title
   */
  @Input() title: string;

  /**
   * The search result subtitle
   */
  @Input() subtitle: string = '';

  /**
   * A label to display more info
   * @type {string}
   */
  @Input() moreInfoLabel: string = '';

  /**
   * Event to trigger once the search result is clicked
   * @type {EventEmitter<any>}
   */
  @Output() searchResultClick: EventEmitter<any> = new EventEmitter<any>();

  /**
   * Event to trigger once the more info is clicked
   * @type {EventEmitter<any>}
   */
  @Output() searchResultMoreInfoClick: EventEmitter<any> = new EventEmitter<any>();

  /**
   * Indicates if to show the more info button
   * @type {boolean}
   */
  public showMoreInfoButton: boolean = false;

  /**
   * The hover state for changing the icon color when hovering over the search result
   */
  public hoverState: 'selected' | '' = '';

  /**
   * On init, check if the more info label is long enough
   */
  ngOnInit(): void {
    this.showMoreInfoButton = this.moreInfoLabel && this.moreInfoLabel.length > 0;
  }

  /**
   * Function called when the search result is clicked
   */
  public onSearchResultClick(): void {
    this.searchResultClick.emit();
  }

  /**
   * Function called when the more info button is clicked
   */
  public onMoreInfoClick(): void {
    this.searchResultMoreInfoClick.emit();
  }

  /**
   * When the user hovers over a search result
   */
  public onMouseEnter(): void {
    this.hoverState = 'selected';
  }

  /**
   * When the user leaves hovering over a search result
   */
  public onMouseLeave(): void {
    this.hoverState = '';
  }
}
