import {UserPreferencesService} from './user-preferences.service';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {TestBed} from '@angular/core/testing';
import {SortOptionsService} from './sort-options.service';
import {UserProfile} from '../models/user-profile';
import {mockUserProfile, mockUserProfileJson} from '../../../assets/test/common-objects/user-profile.mock';
import {IUserPreference} from '../interfaces/iUserPreference';
import {PageContextTypes} from '../enums/page-context-types';

describe('UserPreferencesService', () => {
  let service: UserPreferencesService;
  let httpMock: HttpTestingController;
  let userProfile: UserProfile;

  const getUserHomePreference = (userPreferences: IUserPreference[]) => {
    return userPreferences.find(u => u.pageName === PageContextTypes.USER_HOME);
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserPreferencesService, SortOptionsService]
    });
    service = TestBed.get(UserPreferencesService);
    httpMock = TestBed.get(HttpTestingController);
    userProfile = mockUserProfile;
  });


  describe('Initializing user preferences', () => {
    it('should remove any invalid user preference', () => {
      let userProfileJson = mockUserProfileJson;
      const invalidPageName = 'Test';
      userProfileJson.userPreferences.push({
        pageName: invalidPageName, sortBy: 'effectiveDate', sortAsc: false, editDisplayCount: 0
      });
      const newUser = new UserProfile(userProfileJson);

      const userPreferences = service.initializeUserPreferences(newUser);
      userPreferences.forEach(userPreference => {
        expect(userPreference.sortBy).not.toBe(invalidPageName);
      });
    });

    it('should add the default user preferences when none exist', () => {
      let userProfileJson = mockUserProfileJson;
      userProfileJson.userPreferences = [];
      const newUser = new UserProfile(userProfileJson);

      const userPreferences = service.initializeUserPreferences(newUser);
      const userPreferenceNames = userPreferences.map(u => u.pageName);
      expect(userPreferenceNames).toContain(PageContextTypes.USER_HOME);
      expect(userPreferenceNames).toContain(PageContextTypes.CUSTOMER_HOME);
      expect(userPreferenceNames).toContain(PageContextTypes.NAV_MENU_CUSTOMERS);
      expect(userPreferenceNames).toContain(PageContextTypes.NAV_MENU_PLANS);
    });

    it('should replace an invalid sort by value for \'USER_HOME\' preferences', () => {
      const invalidSortByValue = 'asdfkasdkf';
      const homeUserPreference = getUserHomePreference(userProfile.userPreferences);
      homeUserPreference.sortBy = invalidSortByValue;

      const userPreferences = service.initializeUserPreferences(userProfile);
      const userPreference = getUserHomePreference(userPreferences);
      expect(userPreference).not.toBe(invalidSortByValue);
    });
  });

  describe('Updating user preferences', () => {
    it('should update preferences', () => {
      let newUserPreference = {
        pageName: PageContextTypes.USER_HOME, sortBy: 'effectiveDate', sortAsc: true, editDisplayCount: 1
      };
      let userPreferences = service.updateUserPreferences(userProfile, newUserPreference);
      let homeUserPreference = getUserHomePreference(userPreferences);
      expect(homeUserPreference.editDisplayCount).toBe(1);

      newUserPreference = {
        pageName: PageContextTypes.USER_HOME, sortBy: 'effectiveDate', sortAsc: true, editDisplayCount: 5
      };
      userPreferences = service.updateUserPreferences(userProfile, newUserPreference);
      homeUserPreference = getUserHomePreference(userPreferences);
      expect(homeUserPreference.editDisplayCount).toBe(5);
    });

    it('should add a user preference', () => {
      let json = mockUserProfileJson;
      json.userPreferences = [];
      let newUser = new UserProfile(json);

      let newUserPreference = {
        pageName: PageContextTypes.USER_HOME, sortBy: 'effectiveDate', sortAsc: true, editDisplayCount: 1
      };
      let userPreferences = service.updateUserPreferences(newUser, newUserPreference);
      let homeUserPreference = getUserHomePreference(userPreferences);
      expect(homeUserPreference.editDisplayCount).toBe(1);
    });
  });
});
