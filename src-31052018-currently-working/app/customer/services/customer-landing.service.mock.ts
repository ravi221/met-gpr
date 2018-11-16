import {ICustomer} from '../interfaces/iCustomer';
import {ISortOption} from '../../core/interfaces/iSortOption';
import {Observable} from 'rxjs/Observable';
import {PageAccessType} from '../../core/enums/page-access-type';

/**
 * A mock service of {@link CustomerLandingService}
 */
export class MockCustomerLandingService {
  constructor() {
  }

  public canAddPlan(customer: ICustomer, pageAccessType: PageAccessType): boolean {
    return true;
  }

  public initSortOptions(): ISortOption[] {
    return [{
      active: true,
      label: 'Test',
      sortBy: 'planName',
      sortAsc: false
    }];
  }

  public openAddPlanModal(customer: ICustomer): any {
    return {
      onClose: Observable.of(false)
    };
  }

  public saveUserSortPreference(sortOption: ISortOption): Observable<void> {
    return Observable.of(null);
  }
}
