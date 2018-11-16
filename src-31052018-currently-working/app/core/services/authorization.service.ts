import {Injectable} from '@angular/core';
import {UserProfile} from 'app/core/models/user-profile';
import {AccessRoleType} from '../enums/access-role-type';

@Injectable()
export class AuthorizationService {

    private ALLOWABLE_ROLES = [
        AccessRoleType.STANDARD,
        AccessRoleType.KNOWLEDGE,
        AccessRoleType.SUPER,
        AccessRoleType.SUPPORT
    ];

    /**
     * Default constructor
     */
    constructor() {}

    /**
     * Method to check if user is authorized to view the website
     * @param {UserProfile} user Profile to check if they are authorized
     */
    public isUserAuthorized(user: UserProfile): boolean {
        return this.hasAuthorizedRoles(user, []);
    }
    /**
     * Method to check if user is authorized to based on role
     * @param {UserProfile} user to check if they are authorized
     * @param {AccessRoleType[]} rolesToCheck array of roles to check
     * @param {boolean} matchAllRoles flag to indicate if the method should check for all roles or just one of
     */
    public hasAuthorizedRoles(user: UserProfile, rolesToCheck: AccessRoleType[], matchAllRoles?: boolean): boolean {
        let authorized = false;
        if (this._hasRoles(user)) {
            if (this._hasRolesToCheck(rolesToCheck)) {
                if (matchAllRoles) {
                    authorized = rolesToCheck.every((role) => {
                        return user.userRoles.some(userRole => userRole.roleName === role);
                    });
                } else {
                    authorized = user.userRoles.some(role => rolesToCheck.indexOf(AccessRoleType[role.roleTypeCode]) >= 0);
                }
            } else {
                authorized = user.userRoles.some(role => this.ALLOWABLE_ROLES.indexOf(AccessRoleType[role.roleTypeCode]) >= 0);
            }
        }
        return authorized;
    }

    /**
     * Checks to see if user has roles to check
     * @param {UserProfile} user User to check
     */
    private _hasRoles(user: UserProfile): boolean {
        return user && user.userRoles && user.userRoles.length > 0;
    }
    /**
     * Called to see if a list was provied to check user access against
     * @param rolesToCheck list of roles user might be checked against
     */
    private _hasRolesToCheck(rolesToCheck: AccessRoleType[]): boolean {
        return rolesToCheck && rolesToCheck.length > 0;
    }
}
