import {AccessLevelUtility} from './access-level-utility';
import {IAccessRole} from '../interfaces/iAccessRole';

describe('AccessLevelUtility', () => {
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
  const knowledgeUser: IAccessRole = {
    roleTypeCode: 'KNOWLEDGE',
    roleId: 4,
    roleName: 'knowledge'
  };

  it('should successfully create access level utility', () => {
    const accessLevelUtility = new AccessLevelUtility();
    expect(accessLevelUtility).toBeTruthy();
  });

  describe('Super User', () => {
    it('should return false when user roles are null', () => {
      expect(AccessLevelUtility.isSuperUser(null)).toBeFalsy();
    });

    it('should return false when user roles are undefined', () => {
      expect(AccessLevelUtility.isSuperUser(undefined)).toBeFalsy();
    });

    it('should return false when user roles are empty', () => {
      expect(AccessLevelUtility.isSuperUser([])).toBeFalsy();
    });

    it('should return false when super user is not present', () => {
      expect(AccessLevelUtility.isSuperUser([knowledgeUser, standardUser])).toBeFalsy();
    });

    it('should return true when super user is in the array', () => {
      expect(AccessLevelUtility.isSuperUser([superUser, standardUser])).toBeTruthy();
    });
  });

  describe('Standard User', () => {
    it('should return false when user roles are null', () => {
      expect(AccessLevelUtility.isStandardUser(null)).toBeFalsy();
    });

    it('should return false when user roles are undefined', () => {
      expect(AccessLevelUtility.isStandardUser(undefined)).toBeFalsy();
    });

    it('should return false when user roles are empty', () => {
      expect(AccessLevelUtility.isStandardUser([])).toBeFalsy();
    });

    it('should return false when standard user is not present', () => {
      expect(AccessLevelUtility.isStandardUser([knowledgeUser, superUser])).toBeFalsy();
    });

    it('should return true when standard user is in the array', () => {
      expect(AccessLevelUtility.isStandardUser([superUser, standardUser])).toBeTruthy();
    });
  });

  describe('Readonly User', () => {
    it('should return false when user roles are null', () => {
      expect(AccessLevelUtility.isReadonlyUser(null)).toBeFalsy();
    });

    it('should return false when user roles are undefined', () => {
      expect(AccessLevelUtility.isReadonlyUser(undefined)).toBeFalsy();
    });

    it('should return false when user roles are empty', () => {
      expect(AccessLevelUtility.isReadonlyUser([])).toBeFalsy();
    });

    it('should return false when readonly user is not present', () => {
      expect(AccessLevelUtility.isReadonlyUser([knowledgeUser, superUser])).toBeFalsy();
    });

    it('should return true when readonly user is in the array', () => {
      expect(AccessLevelUtility.isReadonlyUser([superUser, readOnlyUser])).toBeTruthy();
    });
  });

  describe('Knowledge user function', () => {
    it('should return false when user roles are null', () => {
      expect(AccessLevelUtility.isKnowledgeUser(null)).toBeFalsy();
    });

    it('should return false when user roles are undefined', () => {
      expect(AccessLevelUtility.isKnowledgeUser(undefined)).toBeFalsy();
    });

    it('should return false when user roles are empty', () => {
      expect(AccessLevelUtility.isKnowledgeUser([])).toBeFalsy();
    });

    it('should return false when knowledge user is not present', () => {
      expect(AccessLevelUtility.isKnowledgeUser([readOnlyUser, superUser])).toBeFalsy();
    });

    it('should return true when knowledge user is in the array', () => {
      expect(AccessLevelUtility.isKnowledgeUser([knowledgeUser, readOnlyUser])).toBeTruthy();
    });
  });
});
