import {PageAccessService} from './page-access.service';
import {AccessRoleType} from '../enums/access-role-type';
import {PlanProductType} from '../../plan/enums/plan-product-type';
import {PageAccessType} from '../enums/page-access-type';
import {IAccessRole} from '../interfaces/iAccessRole';

describe('PageAccessService', () => {
  let userRoles: IAccessRole[];
  let pageAccessService: PageAccessService = new PageAccessService();
  const superUser: IAccessRole = {
    roleTypeCode: 'SUPER',
    roleId: 1,
    roleName: 'super'
  };
  const standardUser: IAccessRole = {
    roleTypeCode: 'STANDARD',
    roleId: 2,
    roleName: 'standard'
  };
  const readOnlyUser: IAccessRole = {
    roleTypeCode: 'SUPPORT',
    roleId: 3,
    roleName: 'readOnly'
  };
  const unknownRole: IAccessRole = {
    roleTypeCode: 'unknown',
    roleId: 3,
    roleName: 'unknown'
  };

  afterEach( () => {
    userRoles = [];
  });
  it('should return role type read only when when no roles are present', () => {
    const emptyRole = pageAccessService.getAccessType(userRoles);
    expect(emptyRole).toBe(PageAccessType.READ_ONLY);
  });

  it('should return role type read only when when no roles are present', () => {
    userRoles.push(unknownRole);
    const emptyRole = pageAccessService.getAccessType(userRoles);
    expect(emptyRole).toBe(PageAccessType.READ_ONLY);
  });

  it('should return super user when super user is the only item in the array', () => {
    userRoles.push(superUser);
    const superRole = pageAccessService.getAccessType(userRoles);
    expect(superRole).toBe(PageAccessType.SUPER_USER);
  });

  it('should return super user when super user and other users are present', () => {
    userRoles.push(superUser);
    userRoles.push(standardUser);
    const superRole = pageAccessService.getAccessType(userRoles);
    expect(superRole).toBe(PageAccessType.SUPER_USER);
  });

  it('should return standard user when standard user is the only role present', () => {
    userRoles.push(standardUser);
    const standardRole = pageAccessService.getAccessType(userRoles);
    expect(standardRole).toBe(PageAccessType.FULL_STANDARD_ACCESS);
  });

  it('should return standard user when standard and read only are in the roles', () => {
    userRoles.push(standardUser);
    userRoles.push(readOnlyUser);
    const standardRole = pageAccessService.getAccessType(userRoles);
    expect(standardRole).toBe(PageAccessType.FULL_STANDARD_ACCESS);
  });

  it('should return readonly user when readonly user is the only available role', () => {
    userRoles.push(readOnlyUser);
    const readonlyRole = pageAccessService.getAccessType(userRoles);
    expect(readonlyRole).toBe(PageAccessType.READ_ONLY);
  });

});
