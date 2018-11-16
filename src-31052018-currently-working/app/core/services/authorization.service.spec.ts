import {AuthorizationService} from './authorization.service';
import {UserProfile} from '../models/user-profile';
import {AccessRoleType} from '../enums/access-role-type';

describe('AuthorizationService', () => {
  let service: AuthorizationService = new AuthorizationService();

  describe('isUserAuthorized', () => {
    it('should not be authorized when user is null', () => {
      const authorized = service.isUserAuthorized(null);
      expect(authorized).toBeFalsy();
    });
    it('should not be authorized when user null roles', () => {
      const profile = {
        userId: '1234',
        firstName: 'john',
        lastName: 'smith',
        emailAddress: 'john.smith@test.com',
        metnetId: 'jsmith',
        userRoles: null
      };
      const user = new UserProfile(profile);
      const authorized = service.isUserAuthorized(user);
      expect(authorized).toBeFalsy();
    });
    it('should not be authorized when user empty array of roles', () => {
      const profile = {
        userId: '1234',
        firstName: 'john',
        lastName: 'smith',
        emailAddress: 'john.smith@test.com',
        metnetId: 'jsmith',
        userRoles: []
      };
      const user = new UserProfile(profile);
      const authorized = service.isUserAuthorized(user);
      expect(authorized).toBeFalsy();
    });
    it('should not be authorized when user doesn\'t have correct role', () => {
      const profile = {
        userId: '1234',
        firstName: 'john',
        lastName: 'smith',
        emailAddress: 'john.smith@test.com',
        metnetId: 'jsmith',
        userRoles: [
          {
            'roleName': 'CEO',
            'roleId': 66545
          },
          {
            'roleName': 'CFO',
            'roleId': 789745
          },
        ]
      };
      const user = new UserProfile(profile);
      const authorized = service.isUserAuthorized(user);
      expect(authorized).toBeFalsy();
    });
    it('should be authorized when user has correct role', () => {
      const profile = {
        userId: '1234',
        firstName: 'john',
        lastName: 'smith',
        emailAddress: 'john.smith@test.com',
        metnetId: 'jsmith',
        userRoles: [
          {
            'roleName': 'STANDARD',
            'roleId': 1234
          }
        ]
      };
      const user = new UserProfile(profile);
      const authorized = service.isUserAuthorized(user);
      expect(authorized).toBeTruthy();
    });
    it('should be authorized when user has correct role among others', () => {
      const profile = {
        userId: '1234',
        firstName: 'john',
        lastName: 'smith',
        emailAddress: 'john.smith@test.com',
        metnetId: 'jsmith',
        userRoles: [
          {
            'roleName': 'CEO',
            'roleId': 66545
          },
          {
            'roleName': 'CFO',
            'roleId': 789745
          },
          {
            'roleName': 'STANDARD',
            'roleId': 1234
          }
        ]
      };
      const user = new UserProfile(profile);
      const authorized = service.isUserAuthorized(user);
      expect(authorized).toBeTruthy();
    });
  });
  describe('hasAuthorizedRoles', () => {
    it('should not be authorized when user doesn\'t have the necessary role', () => {
      const profile = {
        userId: '1234',
        firstName: 'john',
        lastName: 'smith',
        emailAddress: 'john.smith@test.com',
        metnetId: 'jsmith',
        userRoles: [
          {
            'roleName': 'CEO',
            'roleId': 66545
          },
          {
            'roleName': 'CFO',
            'roleId': 789745
          },
          {
            'roleName': 'STANDARD',
            'roleId': 1234
          }
        ]
      };
      const rolesToCheck = [AccessRoleType.KNOWLEDGE];
      const user = new UserProfile(profile);
      const authorized = service.hasAuthorizedRoles(user, rolesToCheck);
      expect(authorized).toBeFalsy();
    });
    it('should be authorized when user has one of the necessary roles', () => {
      const profile = {
        userId: '1234',
        firstName: 'john',
        lastName: 'smith',
        emailAddress: 'john.smith@test.com',
        metnetId: 'jsmith',
        userRoles: [
          {
            'roleName': 'CEO',
            'roleId': 66545
          },
          {
            'roleName': 'CFO',
            'roleId': 789745
          },
          {
            'roleName': 'STANDARD',
            'roleId': 1234
          }
        ]
      };
      const rolesToCheck = [AccessRoleType.SUPER, AccessRoleType.STANDARD];
      const user = new UserProfile(profile);
      const authorized = service.hasAuthorizedRoles(user, rolesToCheck);
      expect(authorized).toBeTruthy();
    });
    it('should not be authorized when user doesn\'t have all the necessary roles', () => {
      const profile = {
        userId: '1234',
        firstName: 'john',
        lastName: 'smith',
        emailAddress: 'john.smith@test.com',
        metnetId: 'jsmith',
        userRoles: [
          {
            'roleName': 'CEO',
            'roleId': 66545
          },
          {
            'roleName': 'CFO',
            'roleId': 789745
          },
          {
            'roleName': 'STANDARD',
            'roleId': 1234
          }
        ]
      };
      const rolesToCheck = [AccessRoleType.SUPER, AccessRoleType.STANDARD];
      const user = new UserProfile(profile);
      const authorized = service.hasAuthorizedRoles(user, rolesToCheck, true);
      expect(authorized).toBeFalsy();
    });
    it('should be authorized when user has all the necessary roles', () => {
      const profile = {
        userId: '1234',
        firstName: 'john',
        lastName: 'smith',
        emailAddress: 'john.smith@test.com',
        metnetId: 'jsmith',
        userRoles: [
          {
            'roleName': 'SUPER',
            'roleId': 789745
          },
          {
            'roleName': 'STANDARD',
            'roleId': 1234
          }
        ]
      };
      const rolesToCheck = [AccessRoleType.SUPER, AccessRoleType.STANDARD];
      const user = new UserProfile(profile);
      const authorized = service.hasAuthorizedRoles(user, rolesToCheck, true);
      expect(authorized).toBeTruthy();
    });
    it('should be authorized when user has all the necessary roles and more', () => {
      const profile = {
        userId: '1234',
        firstName: 'john',
        lastName: 'smith',
        emailAddress: 'john.smith@test.com',
        metnetId: 'jsmith',
        userRoles: [
          {
            'roleName': 'SUPER',
            'roleId': 789745
          },
          {
            'roleName': 'STANDARD',
            'roleId': 1234
          },
          {
            'roleName': 'KNOWLEDGE',
            'roleId': 12443
          },
          {
            'roleName': 'CFO',
            'roleId': 789745
          },
        ]
      };
      const rolesToCheck = [AccessRoleType.SUPER, AccessRoleType.STANDARD];
      const user = new UserProfile(profile);
      const authorized = service.hasAuthorizedRoles(user, rolesToCheck, true);
      expect(authorized).toBeTruthy();
    });
  });
});
