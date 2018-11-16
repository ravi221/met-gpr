import {IUserPreference} from 'app/core/interfaces/iUserPreference';
import {AccessRoleType} from '../enums/access-role-type';
import {IAccessRole} from 'app/core/interfaces/iAccessRole';

/**
 * This class represents an instance of a user's profile that's currently logged into the application.
 *
 * TODO: This class may need to be extended to have other attributes such as previously defined sort and filtering selections.
 *
 */
export class UserProfile {

  /**
   * The user's user Id
   */
  userId: string;
  /**
   * The user's first name.
   */
  firstName: string;
  /**
   * The user's last name.
   */
  lastName: string;
  /**
   * The user's email address.
   */
  emailAddress: string;
  /**
   * The user's metnet Id.
   */
  metnetId: string;
  /**
   * A collection of the access roles the user currently has.
   */
  userRoles: IAccessRole[];
  /**
   * A collection of user preferences.  Each items applies to a specific page.
   */
  userPreferences: IUserPreference[];

  /**
   * Constructs an instance of the user profile with the provided parameter object.
   * @param userProfile
   */
  constructor(userProfile: any) {
    const NOT_FOUND = Object.keys(AccessRoleType).find(key => AccessRoleType[key] === AccessRoleType.NOT_FOUND);
    this.userId = userProfile.userId;
    this.firstName = userProfile.firstName;
    this.lastName = userProfile.lastName;
    this.emailAddress = userProfile.emailAddress;
    this.metnetId = userProfile.metnetId;
    if (userProfile.userRoles) {
      this.userRoles = userProfile.userRoles.map(role => {
        let roleTypeCode = role.roleName.toUpperCase();
        let roleName = AccessRoleType[role.roleName.toUpperCase()];
        if (!roleName || roleName === '') {
          roleName = AccessRoleType.NOT_FOUND;
          roleTypeCode = NOT_FOUND;
        }
        return <IAccessRole>{roleId: role.roleId, roleTypeCode: roleTypeCode, roleName: roleName};
      });
    }
    this.userPreferences = [];
    if (userProfile.userPreferences) {
      this.userPreferences = userProfile.userPreferences;
    }
  }
}
