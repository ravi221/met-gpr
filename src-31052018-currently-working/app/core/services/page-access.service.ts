import {Injectable} from '@angular/core';
import {PageAccessType} from '../enums/page-access-type';
import {PlanProductType} from '../../plan/enums/plan-product-type';

import {AccessLevelUtility} from '../utilities/access-level-utility';
import {IAccessRole} from '../interfaces/iAccessRole';

/**
 * Determines the level of access for the input user roles
 */
@Injectable()
export class PageAccessService {

  /**
   * Gets the proper access level based on your product and your user roles. The function will return the high level of access available
   * @param {Array<AccessRole>} userRoles
   * @returns {PageAccessType}
   */
  public getAccessType(userRoles: IAccessRole[]): PageAccessType {

    if (AccessLevelUtility.isSuperUser(userRoles)) {
      return PageAccessType.SUPER_USER;
    }  else if (AccessLevelUtility.isStandardUser(userRoles)) {
      return PageAccessType.FULL_STANDARD_ACCESS;
    } else if (AccessLevelUtility.isReadonlyUser(userRoles)) {
      return PageAccessType.READ_ONLY;
    } else {
      return PageAccessType.READ_ONLY;
    }
  }
}
