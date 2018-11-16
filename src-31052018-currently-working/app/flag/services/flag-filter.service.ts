import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';
import { IFlagFilter } from '../interfaces/iFlagFilter';
import { FilterService } from '../../core/services/filter.service';

/**
 * A service to pass filters used in the flag filter menu
 */
@Injectable()
export class FlagFilterService {

   /**
   * Creates the filter component
   * @param {FilterService} _flagService
   */
  constructor(private _filterService: FilterService) {
  }

  /**
   * Gets an observable of the filters
   * @returns {Observable<IFlagFilter>}
   */
  public getFlagFilters(): Observable<IFlagFilter> {
    return this._filterService.getFilters();
  }

  /**
   * Sets the filters
   * @param filters
   */
  public setFlagFilters(filters: IFlagFilter): void {
    this._filterService.setFilters(filters);
  }
}
