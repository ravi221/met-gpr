import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {IProduct} from 'app/core/interfaces/iProduct';
import {HttpClient} from '@angular/common/http';
import {ICoverage} from 'app/core/interfaces/iCoverage';

/**
 * A service to get products in GPR
 */
@Injectable()
export class ProductDataService {

  /**
   * A default list of products, used when there is an error from the server when getting products
   * @type {Observable<Array>}
   */
  private static readonly DEFAULT_PRODUCTS: Observable<IProduct[]> = Observable.of([]);

  /**
   * Creates the product data service
   * @param {HttpClient} _http
   */
  constructor(private _http: HttpClient) {
  }

  /**
   * Gets all products for GPR
   * @returns {Observable<IProduct>}: An observable that resolves a product object
   */
  public getProducts(): Observable<IProduct[]> {
    return this._http.get<IProduct[]>('/products')
      .map(response => response['LKUP']['PROD'])
      .map(data => {
        return data.map(item => {
          return <IProduct>{
            productName: item.PROD_NM,
            coverages: item.CVR.map((coverage) => {
              return <ICoverage>{
                coverageId: coverage.CVR_ID, coverageName: coverage.CVR_NM, ppcModelName: coverage.PPC_MDL_NM
              };
            }).sort((coverageA, coverageB) => {
              return coverageA.coverageName.localeCompare(coverageB.coverageName);
            })
          };
        }).sort(((productA, productB) => {
            return productA.productName.localeCompare(productB.productName);
          }
        ));
      })
      .catch(this._handleError);
  }

  /**
   * Gets a customer's products by their customer number
   * @param {number} customerNumber: The customer number of the customer.
   * @returns {Observable<IProduct[]>}: An observable that resolves an array of products.
   */
  public getProductsForCustomer(customerNumber: number): Observable<IProduct[]> {
    const url = `/customers/${customerNumber}/products`;
    return this._http.get<IProduct[]>(url).catch(this._handleError);
  }

  /**
   * Private method to handle errors when getting products
   * @returns {Observable<IProduct[]>}
   * @private
   */
  private _handleError(): Observable<IProduct[]> {
    return ProductDataService.DEFAULT_PRODUCTS;
  }
}
