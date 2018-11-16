import {Component, EventEmitter, Input, Output} from '@angular/core';

/**
 * Displays a list of attribute search results
 *
 * Usage:
 * ```html
 *     <gpr-search-attribute-list [attributes]="attributes"
 *                                (attributeDetailsClick)="fn($event)"></gpr-search-attribute-list>
 * ```
 */
@Component({
  selector: 'gpr-search-attribute-list',
  template: `
    <div class="search-attribute-list">
      <gpr-search-attribute-list-item *ngFor="let attribute of attributes"
                                      [attribute]="attribute"
                                      (attributeDetailsClick)="onAttributeDetailsClick($event)"></gpr-search-attribute-list-item>
    </div>
  `
})
export class SearchAttributeListComponent {

  /**
   * The customers to display on screen
   */
  @Input() attributes: any[] = [];

  /**
   * Emits an event when the attribute's plans button is clicked
   * @type {EventEmitter<any>}
   */
  @Output() attributeDetailsClick: EventEmitter<any> = new EventEmitter<any>();

  /**
   * When the attribute's details button is clicked
   * @param attribute
   */
  public onAttributeDetailsClick(attribute: any): void {
    this.attributeDetailsClick.emit(attribute);
  }
}
