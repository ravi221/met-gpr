import {Component, EventEmitter, Input, Output} from '@angular/core';
import {IProduct} from '../../interfaces/iProduct';
import {ICoverage} from '../../interfaces/iCoverage';

/**
 * A  multi level drop down component to display a list of products and a flyout list of coverages
 *
 * Usage:
 *       <gpr-product-drop-down [products]="products"></gpr-product-drop-down>
 */
@Component({
  selector: 'gpr-product-drop-down',
  template: `
    <div class="product-drop-down"
         gprOutsideClick
         (outsideClick)="onOutsideClick()">
      <div class="select" (click)="showProductList = true">
        <span>{{selectedCoverage?.coverageName || 'Select'}}</span>
        <i class="material-icons">arrow_drop_down</i>
      </div>
      <ul class="drop-down-list product-list" *ngIf="showProductList">
        <li *ngFor="let product of products" (click)="onProductClick(product)" [class.active]="selectedProduct && selectedProduct.productName === product.productName">
          <span>{{product.productName}}</span>
          <i class="material-icons">keyboard_arrow_right</i>
        </li>
      </ul>
      <ul class="drop-down-list coverage-list" *ngIf="showProductList && showCoverageList">
        <li *ngFor="let coverage of selectedProduct.coverages" (click)="onCoverageClick(coverage)">
          {{coverage.coverageName}}
        </li>
      </ul>
    </div>
  `,
  styleUrls: ['./product-drop-down.component.scss']
})
export class ProductDropDownComponent {

  /**
   * A list of products
   * @type {IProduct}
   */
  @Input() products: IProduct[] = [];

  /**
   * An event emitter when coverage is selected
   * @type {EventEmitter<ICoverage>}
   */
  @Output() coverageSelect: EventEmitter<ICoverage> = new EventEmitter<ICoverage>();

  /**
   * When to show the product list
   * @type {boolean}
   */
  public showProductList: boolean = false;

  /**
   * When to show the coverage list
   * @type {boolean}
   */
  public showCoverageList: boolean = false;

  /**
   * The product that is selected
   */
  public selectedProduct: IProduct;

  /**
   * The coverage that is selected
   */
  public selectedCoverage: ICoverage;

  /**
   * The default constructor.
   */
  constructor() {
  }

  /**
   * Close the menu on click
   */
  public onOutsideClick(): void {
    this.showProductList = false;
    this.showCoverageList = false;
  }

  /**
   * Function called when a product is clicked
   * @param {IProduct} product
   */
  public onProductClick(product: IProduct): void {
    this.selectedProduct = product;
    this.showCoverageList = true;
  }

  /**
   * Function called when a coverage is selected
   * @param {ICoverage} coverage
   */
  public onCoverageClick(coverage: ICoverage): void {
    this.selectedCoverage = coverage;
    this.showProductList = false;
    this.showCoverageList = false;
    this.coverageSelect.emit(coverage);
    this.selectedProduct = null;
  }
}
