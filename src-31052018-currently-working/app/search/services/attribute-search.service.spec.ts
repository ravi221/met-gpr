import {TestBed} from '@angular/core/testing';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {Subscription} from 'rxjs/Subscription';
import {AttributeSearchService} from './attribute-search.service';
import {ISearchResults} from '../interfaces/iSearchResults';
import {ISearchAttributeDetailsRequest} from '../interfaces/iSearchAttributeDetailsRequest';
import * as mockAttributeDetails from '../../../assets/test/search/search-attributes-details.mock.json';

describe('AttributeSearchService', () => {
  let service: AttributeSearchService;
  let httpMock: HttpTestingController;
  let subscription: Subscription;
  let attributeDetailsRequest: ISearchAttributeDetailsRequest;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AttributeSearchService]
    });
    service = TestBed.get(AttributeSearchService);
    httpMock = TestBed.get(HttpTestingController);
    attributeDetailsRequest = {
      customerNumber: 1,
      planIds: ['2'],
      model: 'TEST_MODEL',
      attributeLabel: 'Test Label',
      sortBy: 'planName',
      sortAsc: true,
      page: 1,
      pageSize: 4
    };
  });

  it('should return a list of attributes', () => {

    // Subscribe to result
    subscription = service.searchAttributes(attributeDetailsRequest).subscribe((searchResults: ISearchResults) => {
      subscription.unsubscribe();
      const attributes = searchResults.results;
      expect(attributes).toBeTruthy();
      expect(attributes.length).toBe(4);
    });

    const params = 'model=TEST_MODEL&attributeLabel=Test%20Label&planIds=2&page=1&pageSize=4&sortBy=planName&sortAsc=true';
    const url = `/customers/1/plans/search/details`;
    const method = 'GET';
    const urlWithParams = `${url}?${params}`;

    // Expect Request
    const req = httpMock.expectOne(r => {
      return r.method === method && r.urlWithParams === urlWithParams;
    });


    req.flush(mockAttributeDetails);
    httpMock.verify();
  });
});
