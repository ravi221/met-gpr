import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {click} from '../../../../assets/test/TestHelper';
import {Component, DebugElement, ViewChild} from '@angular/core';
import {IProduct} from '../../interfaces/iProduct';
import {mockProducts} from '../../../../assets/test/common-objects/product-objects.mock';
import {OutsideClickDirective} from '../../../ui-controls/directives/outside-click.directive';
import {ProductDropDownComponent} from './product-drop-down.component';
import {SortWithComparatorPipe} from '../../pipes/sort-with-comparator.pipe';

describe('ProductDropDownComponent', () => {
  let component: TestProductDropDownComponent;
  let fixture: ComponentFixture<TestProductDropDownComponent>;
  let element: DebugElement;
  let dropDown: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        OutsideClickDirective,
        ProductDropDownComponent,
        SortWithComparatorPipe,
        TestProductDropDownComponent
      ]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(TestProductDropDownComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        dropDown = fixture.debugElement.query(By.css('.product-drop-down'));
      });
  }));

  afterEach(() => {
    element = null;
    if (fixture) {
      fixture.destroy();
    }
  });

  describe('Rendering', () => {
    it('should render with the correct number of products', () => {
      const select: DebugElement = fixture.debugElement.query(By.css('.select'));
      click(select);
      fixture.detectChanges();
      const elements: DebugElement[] = fixture.debugElement.queryAll(By.css('.product-list li'));
      expect(elements).toBeTruthy();
      expect(elements.length).toEqual(2);
    });


    it('should render with the proper label for each coverage', () => {
      const select: DebugElement = fixture.debugElement.query(By.css('.select'));
      click(select);
      fixture.detectChanges();

      const elements2: DebugElement[] = fixture.debugElement.queryAll(By.css('.product-list li'));
      expect(elements2).toBeTruthy();
      click(elements2[0]);
      fixture.detectChanges();

      const elements: DebugElement[] = fixture.debugElement.queryAll(By.css('.coverage-list li'));
      elements.forEach((el, key) => {
        const expected = component.products[key].coverages[0].coverageName;
        expect(el.nativeElement.textContent.trim()).toEqual(expected);
      });
    });
  });

  describe('Opening/closing', () => {

    it('should not show the products when showProductList is false', () => {
      const productList: DebugElement = fixture.debugElement.query(By.css('.product-list'));
      expect(productList).toBeNull();
      expect(component.dropDown.showProductList).toBeFalsy();
    });

    it('should show the products when showProductList is true', () => {
      const select: DebugElement = fixture.debugElement.query(By.css('.select'));
      click(select, fixture);
      const productList: DebugElement = fixture.debugElement.query(By.css('.product-list'));
      expect(productList).toBeTruthy();
      expect(component.dropDown.showProductList).toBeTruthy();

    });

    it('should not show the coverages when showCoverageList is false', () => {
      const select: DebugElement = fixture.debugElement.query(By.css('.select'));
      click(select, fixture);
      const coverageList: DebugElement = fixture.debugElement.query(By.css('.coverage-list'));
      expect(coverageList).toBeNull();
      expect(component.dropDown.showCoverageList).toBeFalsy();
    });

    it('should show the coverages when showCoverageList is true', () => {
      const select: DebugElement = fixture.debugElement.query(By.css('.select'));
      click(select, fixture);

      const elements2: DebugElement[] = fixture.debugElement.queryAll(By.css('.product-list li'));
      expect(elements2).toBeTruthy();
      click(elements2[0], fixture);

      const coverageList: DebugElement = fixture.debugElement.query(By.css('.coverage-list'));
      expect(coverageList).toBeTruthy();
      expect(component.dropDown.showCoverageList).toBeTruthy();
    });

    describe('Selecting a coverage', () => {
      let spy: jasmine.Spy;

      beforeEach(() => {
        spy = spyOn(component, 'onCoverageSelected').and.stub();
      });

      it('should emit a change event when the coverage is selected', () => {
        const coverage = component.products[0].coverages[0];
        fixture.detectChanges();
        component.dropDown.onCoverageClick(coverage);
        expect(spy).toHaveBeenCalled();
        expect(spy).toHaveBeenCalledWith(coverage);
      });
    });
  });

  @Component({
    template: `
      <gpr-product-drop-down [products]="products" (coverageSelect)="onCoverageSelected($event)"></gpr-product-drop-down>`
  })
  class TestProductDropDownComponent {
    @ViewChild(ProductDropDownComponent) dropDown;
    public products: IProduct[] = mockProducts;

    public onCoverageSelected(e) {

    }
  }
});
