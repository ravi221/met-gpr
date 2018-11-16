import {Observable} from 'rxjs/Observable';
import {IProduct} from 'app/core/interfaces/iProduct';

/**
 * A mock service for {@link ProductDataService}
 */
export class MockProductDataService {

  public getProducts(): Observable<IProduct[]> {
    return Observable.of([]);
  }

  public getProductsForCustomer(customerNumber: number): Observable<IProduct[]> {
    return Observable.of([]);
  }
}
