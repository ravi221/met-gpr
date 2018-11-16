import {UserProfile} from 'app/core/models/user-profile';
import {ICustomer} from '../../customer/interfaces/iCustomer';
import {Observable} from 'rxjs/Observable';
import {IUserPreference} from '../interfaces/iUserPreference';
import {PageContextTypes} from '../enums/page-context-types';
import {UserPreferencesService} from './user-preferences.service';

/**
 * A mock user object
 */
const mockUser = {
  firstName: 'Charlie',
  lastName: 'Brown',
  emailAddress: 'charlie.brown@metlife.com',
  metnetId: 'cbrown123',
  roles: [
    {
      code: 'STANDARD',
      description: 'General Purpose Access'
    },
    {
      code: 'KNOWLEDGE',
      description: 'Knowledge Editor Access'
    }
  ]
};

/**
 * A mock user profile service
 */
export class MockUserProfileService {

  /**
   * Returns a mock user
   * @returns {UserProfile}
   */
  getCurrentUserProfile() {
    return new UserProfile(mockUser);
  }

  /**
   * Gets the default user preference pages mocked
   * @param {PageContextTypes} pageContext
   * @returns {IUserPreference}
   */
  public getUserPreferenceForPage(pageContext: PageContextTypes): IUserPreference {
    return UserPreferencesService.defaultUserPreferences.find(p => p.pageName === pageContext);
  }

  /**
   * Mocked out data call to save a user preference
   */
  saveUserPreference() {
    return Observable.of(false);
  }

  /**
   * Updates customer visibility, mocked
   * @param {ICustomer} customer
   * @returns {Observable<boolean>}
   */
  updateCustomerVisibility(customer: ICustomer) {
    return Observable.of(false);
  }

  public generateUserPreference(): IUserPreference {
    return null;
  }

  /**
   * Mocked out to get a user's profile
   */
  getUserProfile() {
  }
}
