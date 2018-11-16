import {ChangeDetectionStrategy, Component, Input} from '@angular/core';

/**
 * Displays a list of plans with an attribute search results
 */
@Component({
  selector: 'gpr-search-attribute-details-list',
  template: `
    <div class="attribute-details-list">
      <gpr-search-attribute-details-list-item *ngFor="let attributeDetail of attributeDetails"
                                              [attributeDetails]="attributeDetail"></gpr-search-attribute-details-list-item>
    </div>
  `,
  styles: ['::ng-deep gpr-search-attribute-details-list-item:last-child .search-attribute-details { border-bottom: none}'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchAttributeDetailsListComponent {

  /**
   * The customers to display on screen
   */
  @Input() attributeDetails: any;
}
