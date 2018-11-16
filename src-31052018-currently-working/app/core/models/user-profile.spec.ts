import {UserProfile} from '../models/user-profile';
import {AccessRoleType} from '../enums/access-role-type';

describe('UserProfile', () => {

  describe('Role Tests', () => {
    it('should have 2 not found roles', () => {
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
      expect(user.userRoles).toBeDefined();
      expect(user.userRoles.length).toBe(2);
      expect(user.userRoles[0].roleName).toBe(AccessRoleType.NOT_FOUND);
      expect(user.userRoles[0].roleTypeCode).toBe('NOT_FOUND');
      expect(user.userRoles[1].roleName).toBe(AccessRoleType.NOT_FOUND);
      expect(user.userRoles[1].roleTypeCode).toBe('NOT_FOUND');
    });

    it('should 1 standard role', () => {
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
      expect(user.userRoles).toBeDefined();
      expect(user.userRoles.length).toBe(1);
      expect(user.userRoles[0].roleName).toBe(AccessRoleType.STANDARD);
      expect(user.userRoles[0].roleTypeCode).toBe('STANDARD');
    });

    it('should have 2 not found and 1 standard', () => {
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
      expect(user.userRoles).toBeDefined();
      expect(user.userRoles.length).toBe(3);
      expect(user.userRoles[0].roleName).toBe(AccessRoleType.NOT_FOUND);
      expect(user.userRoles[0].roleTypeCode).toBe('NOT_FOUND');
      expect(user.userRoles[1].roleName).toBe(AccessRoleType.NOT_FOUND);
      expect(user.userRoles[1].roleTypeCode).toBe('NOT_FOUND');
      expect(user.userRoles[2].roleName).toBe(AccessRoleType.STANDARD);
      expect(user.userRoles[2].roleTypeCode).toBe('STANDARD');
    });

    it('should have 1 of each role', () => {
      const profile = {
        userId: '1234',
        firstName: 'john',
        lastName: 'smith',
        emailAddress: 'john.smith@test.com',
        metnetId: 'jsmith',
        userRoles: [
          {
            'roleName': 'SUPPORT',
            'roleId': 66545
          },
          {
            'roleName': 'STANDARD',
            'roleId': 789745
          },
          {
            'roleName': 'SUPER',
            'roleId': 1234
          },
          {
            'roleName': 'KNOWLEDGE',
            'roleId': 987452
          },
          {
            'roleName': 'asdfasdf',
            'roleId': 65644
          }
        ]
      };

      const user = new UserProfile(profile);
      expect(user.userRoles).toBeDefined();
      expect(user.userRoles.length).toBe(5);
      expect(user.userRoles[0].roleName).toBe(AccessRoleType.SUPPORT);
      expect(user.userRoles[0].roleTypeCode).toBe('SUPPORT');
      expect(user.userRoles[1].roleName).toBe(AccessRoleType.STANDARD);
      expect(user.userRoles[1].roleTypeCode).toBe('STANDARD');
      expect(user.userRoles[2].roleName).toBe(AccessRoleType.SUPER);
      expect(user.userRoles[2].roleTypeCode).toBe('SUPER');
      expect(user.userRoles[3].roleName).toBe(AccessRoleType.KNOWLEDGE);
      expect(user.userRoles[3].roleTypeCode).toBe('KNOWLEDGE');
      expect(user.userRoles[4].roleName).toBe(AccessRoleType.NOT_FOUND);
      expect(user.userRoles[4].roleTypeCode).toBe('NOT_FOUND');
    });
  });
});
