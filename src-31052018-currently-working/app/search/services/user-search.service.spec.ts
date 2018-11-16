import {TestBed} from '@angular/core/testing';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {Subscription} from 'rxjs/Subscription';
import * as mockUsers from '../../../assets/test/search/users/search-users.mock.json';
import {UserSearchService} from './user-search.service';
import {ISearchUser} from '../interfaces/iSearchUser';

describe('UserSearchService', () => {
  let service: UserSearchService;
  let httpMock: HttpTestingController;
  let subscription: Subscription;

  const expectEmptyUsers = (mockResponse, done) => {
    const userDetails = 'a';

    // Subscribe to result
    subscription = service.searchUsers(userDetails).subscribe(users => {
      expect(users.length).toBe(0);
      done();
    }, () => {
      done.fail('Should not call error function');
    });

    const params = `userDetails=${userDetails}&page=1&pageSize=5`;
    const url = `/users`;
    const method = 'GET';
    const urlWithParams = `${url}?${params}`;

    // Expect Request
    const req = httpMock.expectOne(r => {
      return r.method === method && r.urlWithParams === urlWithParams;
    });

    // Mock Request
    req.flush(mockResponse);
    httpMock.verify();
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserSearchService]
    });
    service = TestBed.get(UserSearchService);
    httpMock = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    if (subscription) {
      subscription.unsubscribe();
    }
  });

  describe('Search Users', () => {
    it('should return a list of users', (done) => {
      const userDetails = 'a';

      // Subscribe to result
      subscription = service.searchUsers(userDetails).subscribe(users => {
        expect(users.length).toBe(1);
        expect(users).toEqual(mockUsers['users']);
        done();
      }, () => {
        done.fail('Should not call error function');
      });

      const params = `userDetails=${userDetails}&page=1&pageSize=5`;
      const url = `/users`;
      const method = 'GET';
      const urlWithParams = `${url}?${params}`;

      // Expect Request
      const req = httpMock.expectOne(r => {
        return r.method === method && r.urlWithParams === urlWithParams;
      });

      // Mock Request
      req.flush(mockUsers);
      httpMock.verify();
    });

    it('should return an empty list of users when response is null', (done) => {
      expectEmptyUsers(null, done);
    });

    it('should return an empty list of users when users in response is null', (done) => {
      expectEmptyUsers({users: null}, done);
    });

    it('should return an empty list of users when response is undefined', (done) => {
      expectEmptyUsers({users: undefined}, done);
    });

    it('should return an empty list of users when error occurs', (done) => {
      const userDetails = 'a';

      // Subscribe to result
      subscription = service.searchUsers(userDetails).subscribe(users => {
        expect(users.length).toBe(0);
        done();
      });

      const params = `userDetails=${userDetails}&page=1&pageSize=5`;
      const url = `/users`;
      const method = 'GET';
      const urlWithParams = `${url}?${params}`;

      // Expect Request
      const req = httpMock.expectOne(r => {
        return r.method === method && r.urlWithParams === urlWithParams;
      });

      const err = new ErrorEvent('ERROR', {
        error: new Error(),
      });

      // Mock Request
      req.error(err);
      httpMock.verify();
    });
  });

  describe('Formatting Users', () => {
    it('should format a list of users', () => {
      const users: ISearchUser[] = [
        {firstName: 'Test', lastName: 'Last', emailAddress: 'test@metlife.com', userId: '1'},
        {firstName: 'Test2', lastName: 'Last2', emailAddress: 'test2@metlife.com', userId: '2'}
      ];
      const formattedData = service.formatUsers(users);

      users.forEach((user: ISearchUser, index: number) => {
        const formattedUser = formattedData[index];
        expect(formattedUser.title).toContain(user.firstName);
        expect(formattedUser.title).toContain(user.lastName);
        expect(user.emailAddress).toEqual(formattedUser.subtitle);
        expect(user).toEqual(formattedUser.model);
      });
    });
  });
});
