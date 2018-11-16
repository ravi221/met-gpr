import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {ICustomer} from '../../customer/interfaces/iCustomer';
import {CustomerDataService} from '../../customer/services/customer-data.service';
import {IProduct} from '../../core/interfaces/iProduct';
import {ProductDataService} from '../../core/services/product-data.service';

/**
 * A resolver class for retrieving a given customer.
 */
@Injectable()
export class ProductResolverService implements Resolve<IProduct[]> {

  /**
   * Creates the product resolver service, used to get a customer's products
   * @param {CustomerDataService} _dataService
   */
  constructor(private _dataService: ProductDataService) {
  }

  /**
   * Fetches a customer by the specified customer number.
   * @param {ActivatedRouteSnapshot} route: The current activated route.
   * @param {RouterStateSnapshot} state: The router state.
   * @returns {Observable<ICustomer>}: An observable that's accessed via {@link Router} data object.
   */
  public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IProduct[]> {
    const customerNumber = parseInt(route.params.customerNumber);
    return this._dataService.getProductsForCustomer(customerNumber);
  }
}
