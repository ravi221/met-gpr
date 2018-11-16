import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';

/**
 * Validates plans at the category and section level
 */
@Injectable()
export class ValidatePlanMockService {

  constructor() {}

  /**
   * Gets the Validation data for the plan. Conditionally queries based on the active category
   * @param {string} planId
   * @param {string} ppcModelName
   * @param {string} ppcVersion
   * @param {string} categoryId
   */
  public validate(planId: string, ppcModelName: string, ppcVersion: string, categoryId?: string): Observable<any> {
    return Observable.of(null);
  }

  public canValidatePlan(): boolean {
    return true;
  }
}
