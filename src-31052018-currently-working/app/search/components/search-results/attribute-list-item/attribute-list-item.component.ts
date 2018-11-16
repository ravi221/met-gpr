import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

/**
 * Displays a single attribute search result
 *
 * Usage:
 * ```html
 *    <gpr-search-attribute-list-item [attribute]="attribute"
 *                                    (attributeClick)="fn($event)"
 *                                    (attributeDetailsClick)="fn($event)"></gpr-search-attribute-list-item>
 * ```
 */
@Component({
  selector: 'gpr-search-attribute-list-item',
  template: `
    <gpr-search-result
      [title]="attribute.attributeLabel"
      [icon]="'plandoc'"
      [moreInfoLabel]="attributeMoreInfoLabel"
      (searchResultClick)="onSearchResultClick()"
      (searchResultMoreInfoClick)="onSearchResultMoreInfoClick()">
    </gpr-search-result>
  `
})
export class SearchAttributeListItemComponent implements OnInit {

  /**
   * The attribute to display
   */
  @Input() attribute: any;

  /**
   * Event to trigger once an attribute is clicked
   * @type {EventEmitter<any>}
   */
  @Output() attributeClick: EventEmitter<any> = new EventEmitter<any>();

  /**
   * Event to trigger once an attribute is clicked
   * @type {EventEmitter<any>}
   */
  @Output() attributeDetailsClick: EventEmitter<any> = new EventEmitter<any>();

  /**
   * The attribute's more info label
   */
  public attributeMoreInfoLabel: string = '';

  /**
   * On init, setup the subtitle and more info label for the attribute
   */
  ngOnInit(): void {
    this.attributeMoreInfoLabel = `${this.attribute.planIds.length} Plans`;
  }

  /**
   * Function called when the attribute is clicked
   */
  public onSearchResultClick(): void {
    this.attributeClick.emit(this.attribute);
  }

  /**
   * Called when the plans button is clicked for an attribute to open up details
   */
  public onSearchResultMoreInfoClick(): void {
    this.attributeDetailsClick.emit(this.attribute);
  }
}
