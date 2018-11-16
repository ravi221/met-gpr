import {AccessRoleType} from '../enums/access-role-type';
import {IAccessRole} from '../interfaces/iAccessRole';

/**
 * Gets the level of access given a user's access roles
 */
export class AccessLevelUtility {

  /**
   * Determines if the user is a super user
   * @param {Array<IAccessRole>} userRoles
   * @returns {boolean}
   */
  public static isSuperUser(userRoles: IAccessRole[]): boolean {
    return AccessLevelUtility._hasRole(userRoles, AccessRoleType.SUPER);
  }

  /**
   * Determines if the user is a standard user
   * @param {Array<IAccessRole>} userRoles
   * @returns {boolean}
   */
  public static isStandardUser(userRoles: IAccessRole[]): boolean {
    return AccessLevelUtility._hasRole(userRoles, AccessRoleType.STANDARD);
  }

  /**
   * Determines if the user is a  readonly user
   * @param {Array<IAccessRole>} userRoles
   * @returns {boolean}
   */
  public static isReadonlyUser(userRoles: IAccessRole[]): boolean {
    return AccessLevelUtility._hasRole(userRoles, AccessRoleType.SUPPORT);
  }

  /**
   * Determines if the user is a knowledge user
   * @param {Array<IAccessRole>} userRoles
   * @returns {boolean}
   */
  public static isKnowledgeUser(userRoles: IAccessRole[]): boolean {
    return AccessLevelUtility._hasRole(userRoles, AccessRoleType.KNOWLEDGE);
  }

  /**
   * Checks if a user has a defined role
   * @param {IAccessRole[]} userRoles
   * @param {AccessRoleType} roleType
   * @returns {boolean}
   * @private
   */
  private static _hasRole(userRoles: IAccessRole[], roleType: AccessRoleType): boolean {
    if (!userRoles) {
      return false;
    }

    if (userRoles.length === 0) {
      return false;
    }

    return userRoles.filter((role) => AccessRoleType[role.roleTypeCode] === roleType).length > 0;
  }
}
