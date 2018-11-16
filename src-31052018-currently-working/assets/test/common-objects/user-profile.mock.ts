import {UserProfile} from '../../../app/core/models/user-profile';

/**
 * A mocked out user profile
 * @type {UserProfile}
 */
export const mockUserProfile: UserProfile = new UserProfile({
  userId: '3100543',
  firstName: 'Charlie',
  lastName: 'Brown',
  emailAddress: 'charlie.brown@metlife.com',
  metnetId: 'kpreyer',
  userRoles: [
    {
      roleName: 'STANDARD',
      description: 'General Purpose Access',
      roleId: 1234
    },
    {
      roleName: 'KNOWLEDGE',
      description: 'Knowledge Editor Access',
      roleId: 4321
    }
  ],
  userPreferences: [
    {
      pageName: 'GPR Home Page',
      sortBy: 'effectiveDate',
      sortAsc: false,
      editDisplayCount: 0
    }
  ]
});

/**
 * A mocked out json response from the server for a user profile
 */
export const mockUserProfileJson = {
  userId: '3100543',
  firstName: 'Charlie',
  lastName: 'Brown',
  emailAddress: 'charlie.brown@metlife.com',
  metnetId: 'kpreyer',
  userRoles: [
    {
      roleName: 'STANDARD',
      description: 'General Purpose Access',
      roleId: 1234
    },
    {
      roleName: 'KNOWLEDGE',
      description: 'Knowledge Editor Access',
      roleId: 4321
    }
  ],
  userPreferences: [
    {
      pageName: 'GPR Home Page',
      sortBy: 'effectiveDate',
      sortAsc: false,
      editDisplayCount: 0
    }
  ]
};

export const DEFAULT_USER_ROLE = [{
  roleId: '13003',
  roleName: 'Administrator access',
  roleTypeCode: 'SUPER'
}];
