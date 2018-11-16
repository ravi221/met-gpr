import {TestBed} from '@angular/core/testing';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {ProductDataService} from './product-data.service';
import {Subscription} from 'rxjs/Subscription';
import {IProduct} from '../interfaces/iProduct';
import * as mockCustomerProducts from '../../../assets/test/products/customer-products.mock.json';
import * as mockAllProducts from '../../../assets/test/products/all-products.mock.json';

describe('ProductDataService', () => {
  let service: ProductDataService;
  let httpMock: HttpTestingController;
  let subscription: Subscription;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductDataService]
    });
    service = TestBed.get(ProductDataService);
    httpMock = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    if (subscription) {
      subscription.unsubscribe();
      subscription = null;
    }
  });

  describe('All Products', () => {
    it('should get a list of all products', (done) => {
      subscription = service.getProducts().subscribe((products: IProduct[]) => {
        expect(products).toBeTruthy();
        expect(products.length).toBe(5);
        done();
      });

      const url = `/products`;
      const method = 'GET';
      let req = httpMock.expectOne({url, method});
      req.flush(mockAllProducts);
      httpMock.verify();
    });

    it('should return an empty array when getting customer products on error', (done) => {
      subscription = service.getProducts().subscribe((products: IProduct[]) => {
        expect(products.length).toBe(0);
        done();
      });

      const url = `/products`;
      const method = 'GET';
      let req = httpMock.expectOne({url, method});
      let err = new ErrorEvent('ERROR', {
        error: new Error(),
      });
      req.error(err);
      httpMock.verify();
    });
  });

  describe('Customer Products', () => {
    it('should get a list of customer products', (done) => {
      const customerNumber = 1;

      subscription = service.getProductsForCustomer(customerNumber).subscribe((products: IProduct[]) => {
        expect(products).toBeTruthy();
        expect(products.length).toBe(1);
        done();
      });

      const url = `/customers/${customerNumber}/products`;
      const method = 'GET';
      let req = httpMock.expectOne({url, method});
      req.flush(mockCustomerProducts);
      httpMock.verify();
    });

    it('should return an empty array when getting customer products on error', (done) => {
      const customerNumber = 1;

      subscription = service.getProductsForCustomer(customerNumber).subscribe((products: IProduct[]) => {
        expect(products.length).toBe(0);
        done();
      });

      const url = `/customers/${customerNumber}/products`;
      const method = 'GET';
      let req = httpMock.expectOne({url, method});
      let err = new ErrorEvent('ERROR', {
        error: new Error(),
      });
      req.error(err);
      httpMock.verify();
    });
  });
});
