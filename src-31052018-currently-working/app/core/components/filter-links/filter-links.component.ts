import {Component, EventEmitter, Input, Output} from '@angular/core';
import {IFilterLink} from '../../interfaces/iFilterLink';

/**
 * Represents a list of filter links
 */
@Component({
  selector: 'gpr-filter-links',
  template: `
    <ul class="filter-links">
      <li *ngFor="let filterLink of filterLinks" class="filter-link">
        <a (click)="handleFilterLinkClick(filterLink)" [class.active]="filterLink.active">{{filterLink.label}}</a>
      </li>
    </ul>
  `,
  styleUrls: ['./filter-links.component.scss']
})
export class FilterLinksComponent {

  /**
   * A list of filter links to display
   * @type {Array}
   */
  @Input() filterLinks: IFilterLink[] = [];

  /**
   * Handles when the active filter link has changed
   * @type {EventEmitter<IFilterLink>}
   */
  @Output() filterLinkChange: EventEmitter<IFilterLink> = new EventEmitter<IFilterLink>();

  /**
   * Handles when a filter link is clicked
   * @param {IFilterLink} filterLink
   */
  public handleFilterLinkClick(filterLink: IFilterLink): void {
    this.filterLinks.forEach(f => f.active = false);
    filterLink.active = true;
    this.filterLinkChange.emit(filterLink);
  }
}
