import {AccessRoleType} from '../enums/access-role-type';

/**
 * Interface that defines what makes up an Access Role
 */
export interface IAccessRole {
    /**
     * Role Type made up of valid roles
    */
    roleTypeCode: string;
    /**
     * Role Id associated with the role that comes from IBSE
    */
    roleId: number;
    /**
     * Role Name associated with the role that comes from IBSE
    */
    roleName: string;
}
