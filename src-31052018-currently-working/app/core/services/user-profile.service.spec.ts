import {fakeAsync, TestBed, tick} from '@angular/core/testing';

import {UserProfileService} from './user-profile.service';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {UserProfile} from 'app/core/models/user-profile';
import {AccessRoleType} from 'app/core/enums/access-role-type';
import * as mockProfile from '../../../assets/test/user/user-profile.mock.json';
import * as mockProfileNoPref from '../../../assets/test/user/user-profile-no-pref.mock.json';
import * as mockProfilePrefSave from '../../../assets/test/user/user-profile-pref-save.mock.json';
import {IUserPreference} from 'app/core/interfaces/iUserPreference';
import {ICustomer} from 'app/customer/interfaces/iCustomer';
import {Subscription} from 'rxjs/Subscription';
import {LogoutService} from '../../navigation/services/logout.service';
import {Idle, IdleExpiry} from '@ng-idle/core';
import {MockIdleExpiry} from 'app/core/services/idle-expiry.mock';
import {AuthorizationService} from 'app/core/services/authorization.service';
import {PageContextTypes} from '../enums/page-context-types';
import {UserPreferencesService} from './user-preferences.service';
import {SortOptionsService} from './sort-options.service';
import {IAccessRole} from 'app/core/interfaces/iAccessRole';
import {mockCustomer} from '../../../assets/test/common-objects/customer.mock';

describe('UserProfileService', () => {
  let service: UserProfileService;
  let httpMock: HttpTestingController;
  let promise: Promise<UserProfile>;
  let subscription: Subscription;

  let populateUser = () => {
    promise = service.getUserProfile('kpreyer');

    const reqStub = httpMock.expectOne('/users/kpreyer/profile/');
    expect(reqStub.request.method).toEqual('GET');
    reqStub.flush(mockProfile);
    httpMock.verify();

    tick();
  };

  let populateUserNoPref = () => {
    promise = service.getUserProfile('kpreyer');

    const reqStub = httpMock.expectOne('/users/kpreyer/profile/');
    expect(reqStub.request.method).toEqual('GET');
    reqStub.flush(mockProfileNoPref);
    httpMock.verify();

    tick();
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        SortOptionsService,
        UserPreferencesService,
        UserProfileService,
        LogoutService,
        Idle,
        {provide: IdleExpiry, useClass: MockIdleExpiry},
        AuthorizationService
      ]
    });

    service = TestBed.get(UserProfileService);
    httpMock = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    if (promise) {
      promise = null;
    }
    if (subscription) {
      subscription.unsubscribe();
      subscription = null;
    }
  });

  describe('Getting user profile', () => {
    it('should return null user when metnetId is null', (done) => {
      promise = service.getUserProfile(null);
      promise.then(userProfile => {
        expect(userProfile).toBeNull();
        done();
      });
    });

    it('should return null user when metnetId is undefined', (done) => {
      promise = service.getUserProfile(undefined);
      promise.then(userProfile => {
        expect(userProfile).toBeNull();
        done();
      });
    });

    it('should return null user when metnetId is empty', (done) => {
      promise = service.getUserProfile('');
      promise.then(userProfile => {
        expect(userProfile).toBeNull();
        done();
      });
    });

    it('should return null user when service call errors out', (done) => {
      promise = service.getUserProfile('kpreyer');
      promise.then(userProfile => {
        expect(userProfile).toBeNull();
        done();
      });
      const reqStub = httpMock.expectOne('/users/kpreyer/profile/');
      expect(reqStub.request.method).toEqual('GET');
      reqStub.error(new ErrorEvent('error'));
      httpMock.verify();
    });

    it('should return null user when metnetId is unauthorized', (done) => {
      spyOn(TestBed.get(AuthorizationService), 'isUserAuthorized').and.returnValue(false);
      promise = service.getUserProfile('kpreyer');
      promise.then(userProfile => {
        expect(userProfile).toBeNull();
        done();
      });
      const reqStub = httpMock.expectOne('/users/kpreyer/profile/');
      expect(reqStub.request.method).toEqual('GET');
      reqStub.flush(mockProfile);
      httpMock.verify();
    });

    it('should return an instance of user profile', (done) => {
      promise = service.getUserProfile('kpreyer');
      promise.then(userProfile => {
        expect(userProfile).toEqual(jasmine.any(UserProfile));
        expect(userProfile.firstName).toEqual('Charlie');
        expect(userProfile.lastName).toEqual('Brown');
        expect(userProfile.emailAddress).toEqual('charlie.brown@metlife.com');
        expect(userProfile.metnetId).toEqual('kpreyer');
        expect(userProfile.userRoles.length).toEqual(2);
        expect(userProfile.userRoles.some(role => role.roleName === AccessRoleType.STANDARD)).toBeTruthy();
        expect(userProfile.userRoles.some(role => role.roleName === AccessRoleType.KNOWLEDGE)).toBeTruthy();
        done();
      });
      const reqStub = httpMock.expectOne('/users/kpreyer/profile/');
      expect(reqStub.request.method).toEqual('GET');
      reqStub.flush(mockProfile);
      httpMock.verify();
    });

    it('should return the correct roles of the current user profile', fakeAsync(() => {
      promise = service.getUserProfile('kpreyer');

      const reqStub = httpMock.expectOne('/users/kpreyer/profile/');
      expect(reqStub.request.method).toEqual('GET');
      reqStub.flush(mockProfile);
      httpMock.verify();

      tick();

      populateUser();
      const roles: IAccessRole[] = service.getRoles();
      expect(roles.some(role => role.roleName === AccessRoleType.STANDARD)).toBeTruthy();
      expect(roles.some(role => role.roleName === AccessRoleType.KNOWLEDGE)).toBeTruthy();
    }));

    it('should return an empty array of roles if current user is not present', () => {
      const roles: IAccessRole[] = service.getRoles();
      expect(roles.length).toBe(0);
    });
  });

  it('should return user preferences', fakeAsync(() => {
    populateUser();
    const userPreferences: IUserPreference = service.getUserPreferenceForPage(PageContextTypes.USER_HOME);
    expect(userPreferences.sortBy).toBe('effectiveDate');
    expect(userPreferences.sortAsc).toBe(false);
    expect(userPreferences.editDisplayCount).toBe(0);
  }));

  it('should return default preferences when user does not have any preferences defined', fakeAsync(() => {
    populateUserNoPref();
    const userPreferences: IUserPreference = service.getUserPreferenceForPage(PageContextTypes.USER_HOME);
    expect(userPreferences.sortBy).toBe('lastActivity');
    expect(userPreferences.sortAsc).toBe(true);
    expect(userPreferences.editDisplayCount).toBe(0);
  }));

  it('should save user preferences and update user class in user profile service', fakeAsync(() => {
    populateUser();

    let userPref: IUserPreference = {
      pageName: PageContextTypes.USER_HOME,
      sortAsc: true,
      sortBy: 'customerName',
      editDisplayCount: 0
    };

    subscription = service.saveUserPreference(userPref).subscribe(response => {
      let userPreference: IUserPreference = response.userPreferences.find(x => x.pageName = 'User Home');

      expect(response.userId).toEqual('3100543');
      expect(userPreference.sortBy).toEqual('customerName');
      expect(userPreference.sortAsc).toEqual(true);
      expect(userPreference.editDisplayCount).toEqual(0);
    });
    const reqStub = httpMock.expectOne('/users/kpreyer/profile/preference/');
    expect(reqStub.request.method).toBe('PUT');
    expect(reqStub.request.body).toEqual(userPref);
    reqStub.flush(mockProfilePrefSave);
    httpMock.verify();

    const userPreferences: IUserPreference = service.getUserPreferenceForPage(PageContextTypes.USER_HOME);
    expect(userPreferences.sortBy).toBe('customerName');
    expect(userPreferences.sortAsc).toBe(true);
    expect(userPreferences.editDisplayCount).toBe(0);
  }));

  describe('Update customer visibility', () => {
    it('should make call to update customer visibility', fakeAsync(() => {
      populateUser();

      subscription = service.updateCustomerVisibility(mockCustomer).subscribe((response) => {
        expect(response.responseMessage).toBe('Success');
        expect(response.userId).toBe('kpreyer');
      });

      const params = 'hidden=false';
      const url = `/users/kpreyer/profile/customers/1234/`;
      const method = 'PUT';
      const urlWithParams = `${url}?${params}`;

      // Expect Request
      const req = httpMock.expectOne(r => {
        return r.method === method && r.urlWithParams === urlWithParams;
      });

      // Mock Request
      req.flush({
        responseMessage: 'Success',
        userId: 'kpreyer'
      });
      httpMock.verify();
    }));

    it('should not update customer visibility and return a default response error', fakeAsync(() => {
      populateUser();

      subscription = service.updateCustomerVisibility(mockCustomer).subscribe((response) => {
        expect(response.responseMessage).toBe('Error');
      });

      const params = 'hidden=false';
      const url = `/users/kpreyer/profile/customers/1234/`;
      const method = 'PUT';
      const urlWithParams = `${url}?${params}`;

      // Expect Request
      const req = httpMock.expectOne(r => {
        return r.method === method && r.urlWithParams === urlWithParams;
      });

      const err = new ErrorEvent('error', {
        error: new Error(),
      });
      req.error(err);
      httpMock.verify();
    }));
  });

  describe('Adding a customer to a user', () => {
    it('should add a customer to a user', fakeAsync(() => {
      populateUser();
      const customerNumber = 1;

      // Subscribe to result
      subscription = service.addCustomerToCurrentUser(customerNumber).subscribe((response) => {
        expect(response.responseMessage).toBe('Success');
        expect(response.userId).toBe('kpreyer');
      });

      const params = 'hidden=false';
      const url = `/users/kpreyer/profile/customers/1/`;
      const method = 'PUT';
      const urlWithParams = `${url}?${params}`;

      // Expect Request
      // There is currently an error when testing http calls with query params, this is the work around
      // https://github.com/angular/angular/issues/19974
      const req = httpMock.expectOne(r => {
        return r.method === method && r.urlWithParams === urlWithParams;
      });

      // Mock Request
      req.flush({
        responseMessage: 'Success',
        userId: 'kpreyer'
      });
      httpMock.verify();
    }));

    it('should not add a customer to a user and return a default response error', fakeAsync(() => {
      populateUser();
      const customerNumber = 1;

      // Subscribe to result
      subscription = service.addCustomerToCurrentUser(customerNumber).subscribe((response) => {
        expect(response.responseMessage).toBe('Error');
      });

      const params = 'hidden=false';
      const url = `/users/kpreyer/profile/customers/1/`;
      const method = 'PUT';
      const urlWithParams = `${url}?${params}`;

      // Expect Request
      // There is currently an error when testing http calls with query params, this is the work around
      // https://github.com/angular/angular/issues/19974
      const req = httpMock.expectOne(r => {
        return r.method === method && r.urlWithParams === urlWithParams;
      });

      // Mock Request
      const err = new ErrorEvent('ERROR', {
        error: new Error()
      });
      req.error(err);
      httpMock.verify();
    }));
  });
});
