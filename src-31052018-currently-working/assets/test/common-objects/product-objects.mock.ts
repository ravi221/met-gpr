/**
 * Mock Product
 *
 */
import {IProduct} from '../../../app/core/interfaces/iProduct';
import {ICoverage} from '../../../app/core/interfaces/iCoverage';

export const mockProducts: IProduct[] = [
  {
    productName: 'Test  Product',
    coverages: [<ICoverage> {
      coverageId: '01',
      coverageName: 'Test Coverage',
      ppcModelName: 'test'
    },
      <ICoverage> {
        coverageId: '01',
        coverageName: 'Test Coverage',
        ppcModelName: 'test'
      }]
  }, {
    productName: 'Test  Product',
    coverages: [<ICoverage> {
      coverageId: '',
      coverageName: 'Test Coverage',
      ppcModelName: ''
    }, <ICoverage> {
      coverageId: '01',
      coverageName: 'Test Coverage',
      ppcModelName: 'test'
    }]
  }];


