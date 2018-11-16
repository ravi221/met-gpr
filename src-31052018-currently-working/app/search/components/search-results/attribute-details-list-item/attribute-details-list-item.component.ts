import {ChangeDetectionStrategy, Component, Input, OnChanges, OnInit} from '@angular/core';

/**
 * Displays a single plan with an attribute
 */
@Component({
  selector: 'gpr-search-attribute-details-list-item',
  template: `
    <div class="search-attribute-details">
      <h1 class="plan-name">{{attributeDetails.planName}}</h1>
      <gpr-search-result
        [title]="attributeDetails.attributeLabel"
        [subtitle]="attributeDetailsSubtitle"
        [icon]="'plandoc'">
      </gpr-search-result>
      <aside class="effective-date">Effective: {{attributeDetails.effectiveDate}}</aside>
    </div>

  `,
  styleUrls: ['./attribute-details-list-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchAttributeDetailsListItemComponent implements OnInit, OnChanges {

  /**
   * The string value when the attribute does not have a value
   * @type {string}
   */
  private static readonly NO_ATTRIBUTE_VALUE: string = '(No Selection)';

  /**
   * The attribute details to display
   */
  @Input() attributeDetails: any;

  /**
   * The attribute detail's subtitle
   * @type {string}
   */
  public attributeDetailsSubtitle: string = '';

  /**
   * On init, setup the subtitle and more info label for the attribute
   */
  ngOnInit(): void {
    this._initSubtitle();
  }

  /**
   * On changes, update the attribute details subtitle
   */
  ngOnChanges(): void {
    if (this.attributeDetails) {
      this._initSubtitle();
    }
  }

  /**
   * Initializes the subtitle
   */
  private _initSubtitle(): void {
    let attributeValue = this.attributeDetails.attributeValue;
    if (attributeValue.length === 0) {
      attributeValue = SearchAttributeDetailsListItemComponent.NO_ATTRIBUTE_VALUE;
    }
    this.attributeDetailsSubtitle = attributeValue;
  }
}
