import {PagingService} from './paging.service';
import {ScrollDirection} from 'app/ui-controls/enums/scroll-direction';
import {IPaging} from 'app/customer/interfaces/iPaging';
import {ISortPreferences} from 'app/core/interfaces/iSortPreferences';
import {ICustomer} from 'app/customer/interfaces/iCustomer';
import {ScrollService} from './scroll.service';
import {IPagingDefaultOptions} from 'app/customer/interfaces/iPagingDefault';
import {CustomerStatus} from '../../customer/enums/customer-status';

describe('PagingService', () => {
  let pagingService: PagingService;

  let pagingObject: IPaging = {
    page: 1,
    totalCount: 14,
    pageSize: 3,
    direction: ScrollDirection.NEXT,
    viewWindowPages: 2,
    viewWindowStartIndex: 0,
    viewWindowMaxStartIndex: 9,
    viewWindowEndIndex: 3,
    viewWindowItems: 6,
    pagesRetrieved: 1
  };

  let sortPreferences: ISortPreferences = {
    sortBy: 'lastActivity',
    sortAsc: true
  };

  let DEFAULT_PAGING_OPTIONS: IPagingDefaultOptions = {
    page: 1,
    pageSize: 3,
    viewWindowPages: 2
  };

  let displayItems: ICustomer[] = [
    {
      customerName: '1',
      customerNumber: 5555555,
      effectiveDate: '06/01/2017',
      status: CustomerStatus.UNAPPROVED,
      percentageCompleted: 50,
      market: 'Regional',
      hiddenStatus: false,
      scrollVisibility: null
    },
    {
      customerName: '1',
      customerNumber: 98065,
      effectiveDate: '02/15/2018',
      status: CustomerStatus.UNAPPROVED,
      percentageCompleted: 0,
      market: 'Regional',
      hiddenStatus: false,
      scrollVisibility: null
    },
    {
      customerName: '1',
      customerNumber: 67887,
      effectiveDate: '12/01/2017',
      status: CustomerStatus.UNAPPROVED,
      percentageCompleted: 68,
      market: 'Regional',
      hiddenStatus: false,
      scrollVisibility: null
    }
  ];

  let resultItemsPage2: ICustomer[] = [
    {
      customerName: '2',
      customerNumber: 5555555,
      effectiveDate: '06/01/2017',
      status: CustomerStatus.UNAPPROVED,
      percentageCompleted: 50,
      market: 'Regional',
      hiddenStatus: false,
      scrollVisibility: true
    },
    {
      customerName: '2',
      customerNumber: 98065,
      effectiveDate: '02/15/2018',
      status: CustomerStatus.UNAPPROVED,
      percentageCompleted: 0,
      market: 'Regional',
      hiddenStatus: false,
      scrollVisibility: true
    },
    {
      customerName: '2',
      customerNumber: 67887,
      effectiveDate: '12/01/2017',
      status: CustomerStatus.UNAPPROVED,
      percentageCompleted: 68,
      market: 'Regional',
      hiddenStatus: false,
      scrollVisibility: true
    }
  ];

  let resultItemsPage3: ICustomer[] = [
    {
      customerName: '3',
      customerNumber: 5555555,
      effectiveDate: '06/01/2017',
      status: CustomerStatus.UNAPPROVED,
      percentageCompleted: 50,
      market: 'Regional',
      hiddenStatus: false,
      scrollVisibility: true
    },
    {
      customerName: '3',
      customerNumber: 98065,
      effectiveDate: '02/15/2018',
      status: CustomerStatus.UNAPPROVED,
      percentageCompleted: 0,
      market: 'Regional',
      hiddenStatus: false,
      scrollVisibility: true
    },
    {
      customerName: '3',
      customerNumber: 67887,
      effectiveDate: '12/01/2017',
      status: CustomerStatus.UNAPPROVED,
      percentageCompleted: 68,
      market: 'Regional',
      hiddenStatus: false,
      scrollVisibility: true
    }
  ];

  let resultItemsPage4: ICustomer[] = [
    {
      customerName: '4',
      customerNumber: 5555555,
      effectiveDate: '06/01/2017',
      status: CustomerStatus.UNAPPROVED,
      percentageCompleted: 50,
      market: 'Regional',
      hiddenStatus: false,
      scrollVisibility: true
    },
    {
      customerName: '4',
      customerNumber: 98065,
      effectiveDate: '02/15/2018',
      status: CustomerStatus.UNAPPROVED,
      percentageCompleted: 0,
      market: 'Regional',
      hiddenStatus: false,
      scrollVisibility: true
    },
    {
      customerName: '4',
      customerNumber: 67887,
      effectiveDate: '12/01/2017',
      status: CustomerStatus.UNAPPROVED,
      percentageCompleted: 68,
      market: 'Regional',
      hiddenStatus: false,
      scrollVisibility: true
    }
  ];

  let partialResultItemsPage1: ICustomer[] = [
    {
      customerName: '1',
      customerNumber: 5555555,
      effectiveDate: '06/01/2017',
      status: CustomerStatus.UNAPPROVED,
      percentageCompleted: 50,
      market: 'Regional',
      hiddenStatus: false,
      scrollVisibility: true
    }
  ];

  let partialResultItemsPage2: ICustomer[] = [
    {
      customerName: '2',
      customerNumber: 5555555,
      effectiveDate: '06/01/2017',
      status: CustomerStatus.UNAPPROVED,
      percentageCompleted: 50,
      market: 'Regional',
      hiddenStatus: false,
      scrollVisibility: true
    }
  ];

  let partialResultItemsPage3: ICustomer[] = [
    {
      customerName: '3',
      customerNumber: 5555555,
      effectiveDate: '06/01/2017',
      status: CustomerStatus.UNAPPROVED,
      percentageCompleted: 50,
      market: 'Regional',
      hiddenStatus: false,
      scrollVisibility: true
    }
  ];

  let resetDisplayItems = () => {
    displayItems = [
      {
        customerName: '1',
        customerNumber: 5555555,
        effectiveDate: '06/01/2017',
        status: CustomerStatus.UNAPPROVED,
        percentageCompleted: 50,
        market: 'Regional',
        hiddenStatus: false,
        scrollVisibility: null
      },
      {
        customerName: '1',
        customerNumber: 98065,
        effectiveDate: '02/15/2018',
        status: CustomerStatus.UNAPPROVED,
        percentageCompleted: 0,
        market: 'Regional',
        hiddenStatus: false,
        scrollVisibility: null
      },
      {
        customerName: '1',
        customerNumber: 67887,
        effectiveDate: '12/01/2017',
        status: CustomerStatus.UNAPPROVED,
        percentageCompleted: 68,
        market: 'Regional',
        hiddenStatus: false,
        scrollVisibility: null
      }
    ];
  };

  let resetSortPreferences = () => {
    DEFAULT_PAGING_OPTIONS = {
      page: 1,
      pageSize: 3,
      viewWindowPages: 2
    };
  };

  beforeEach(() => {
    pagingService = new PagingService(new ScrollService());

    resetDisplayItems();
    resetSortPreferences();
  });

  describe('getNextPageNumber', () => {
    it('should get the next page number', () => {
      let nextPage = pagingService.getNextPageNumber(pagingObject);
      expect(nextPage).toBe(pagingObject.page + 1);
    });

    it('should throw an error when paging object is null', () => {
      expect(function () {
        pagingService.getNextPageNumber(null);
      }).toThrow();
    });
  });

  describe('Initialization', () => {
    it('should initialize a paging object', () => {
      let paging: IPaging;
      paging = pagingService.initializePaging(3, 14, DEFAULT_PAGING_OPTIONS);

      expect(paging.direction).toBe(null);
      expect(paging.page).toBe(1);
      expect(paging.totalCount).toBe(14);
      expect(paging.pageSize).toBe(3);
      expect(paging.viewWindowPages).toBe(2);
      expect(paging.viewWindowStartIndex).toBe(0);
      expect(paging.viewWindowMaxStartIndex).toBe(9);
      expect(paging.viewWindowEndIndex).toBe(3);
      expect(paging.viewWindowItems).toBe(6);
      expect(paging.pagesRetrieved).toBe(1);
    });

    describe('throw errors', () => {
      it('should throw error when sort preferences is null', () => {
        expect(() =>
          pagingService.initializePaging(3, 14, null)).toThrow();
      });

      it('should throw error when arrayLength is null', () => {
        expect(() =>
          pagingService.initializePaging(3, null, DEFAULT_PAGING_OPTIONS)).toThrow();
      });

      it('should throw error when totalCount is null', () => {
        expect(() =>
          pagingService.initializePaging(3, null, DEFAULT_PAGING_OPTIONS)).toThrow();
      });

      it('should throw error when sortPreferences.pageSize is null', () => {
        DEFAULT_PAGING_OPTIONS.pageSize = null;
        expect(() =>
          pagingService.initializePaging(3, null, DEFAULT_PAGING_OPTIONS)).toThrow();
      });

      it('should throw error when sortPreferences.viewWindowPages is null', () => {
        DEFAULT_PAGING_OPTIONS.viewWindowPages = null;
        expect(() =>
          pagingService.initializePaging(3, null, DEFAULT_PAGING_OPTIONS)).toThrow();
      });

      it('should throw error when sortPreferences.page is null', () => {
        DEFAULT_PAGING_OPTIONS.page = null;
        expect(() =>
          pagingService.initializePaging(3, null, DEFAULT_PAGING_OPTIONS)).toThrow();
      });
      it('should throw error when arrayLength is null', () => {
        DEFAULT_PAGING_OPTIONS.page = null;
        expect(() =>
          pagingService.initializePaging(null, 3, DEFAULT_PAGING_OPTIONS)).toThrow();
      });
    });

    it('should return with default values when arrayLength 0', () => {
      let paging: IPaging;
      paging = pagingService.initializePaging(0, 5, DEFAULT_PAGING_OPTIONS);

      expect(paging.direction).toBe(null);
      expect(paging.page).toBe(1);
      expect(paging.totalCount).toBe(5);
      expect(paging.pageSize).toBe(3);
      expect(paging.viewWindowPages).toBe(2);
      expect(paging.viewWindowStartIndex).toBe(0);
      expect(paging.viewWindowMaxStartIndex).toBe(0);
      expect(paging.viewWindowEndIndex).toBe(0);
      expect(paging.viewWindowItems).toBe(6);
      expect(paging.pagesRetrieved).toBe(1);
    });
    it('should return with default values when totalLength 0', () => {
      let paging: IPaging;
      paging = pagingService.initializePaging(5, 0, DEFAULT_PAGING_OPTIONS);

      expect(paging.direction).toBe(null);
      expect(paging.page).toBe(1);
      expect(paging.totalCount).toBe(0);
      expect(paging.pageSize).toBe(3);
      expect(paging.viewWindowPages).toBe(2);
      expect(paging.viewWindowStartIndex).toBe(0);
      expect(paging.viewWindowMaxStartIndex).toBe(0);
      expect(paging.viewWindowEndIndex).toBe(5);
      expect(paging.viewWindowItems).toBe(6);
      expect(paging.pagesRetrieved).toBe(1);
    });
  });

  describe('processItems', () => {
    it('should throw an error when paging object has not been initialized', () => {
      let paging: IPaging;
      expect(() =>
        pagingService.processItems(displayItems, resultItemsPage2, paging)).toThrow();
    });

    it('should process next full pages page 1 to page 2', () => {
      let paging: IPaging;
      paging = pagingService.initializePaging(3, 6, DEFAULT_PAGING_OPTIONS);

      paging.direction = ScrollDirection.NEXT;
      pagingService.processItems(displayItems, resultItemsPage2, paging);
      expect(displayItems.length).toBe(6);
      expect(paging.viewWindowStartIndex).toBe(0);
      expect(paging.viewWindowEndIndex).toBe(6);
      expect(paging.page).toBe(2);
      expect(paging.pagesRetrieved).toBe(2);
      let resultCustomers: ICustomer[] = [];
      displayItems.forEach(x => {
        if (x.scrollVisibility === true && (x.customerName === '1' || x.customerName === '2')) {
          resultCustomers.push(x);
        }
      });

      expect(resultCustomers.length).toBe(6);
    });

    it('should process next partial page, page 1 to page 2', () => {
      let paging: IPaging;
      paging = pagingService.initializePaging(3, 4, DEFAULT_PAGING_OPTIONS);
      paging.direction = ScrollDirection.NEXT;
      pagingService.processItems(displayItems, partialResultItemsPage2, paging);
      expect(displayItems.length).toBe(4);
      expect(paging.viewWindowStartIndex).toBe(0);
      expect(paging.viewWindowEndIndex).toBe(4);
      expect(paging.page).toBe(2);
      expect(paging.pagesRetrieved).toBe(2);
      let resultCustomers: ICustomer[] = [];
      displayItems.forEach(x => {
        if (x.scrollVisibility === true && (x.customerName === '1' || x.customerName === '2')) {
          resultCustomers.push(x);
        }
      });

      expect(resultCustomers.length).toBe(4);
    });

    it('should process next full pages, page 1 to page 3', () => {
      let paging: IPaging;
      paging = pagingService.initializePaging(3, 9, DEFAULT_PAGING_OPTIONS);
      paging.direction = ScrollDirection.NEXT;
      pagingService.processItems(displayItems, resultItemsPage2, paging);
      paging.direction = ScrollDirection.NEXT;
      pagingService.processItems(displayItems, resultItemsPage3, paging);

      expect(displayItems.length).toBe(9);
      expect(paging.viewWindowStartIndex).toBe(3);
      expect(paging.viewWindowEndIndex).toBe(9);
      expect(paging.page).toBe(3);
      expect(paging.pagesRetrieved).toBe(3);
      let visibleCustomers: ICustomer[] = [];
      let hiddenCustomers: ICustomer[] = [];
      displayItems.forEach(x => {
        if (x.scrollVisibility === true && (x.customerName === '2' || x.customerName === '3')) {
          visibleCustomers.push(x);
        } else {
          hiddenCustomers.push(x);
        }
      });

      expect(visibleCustomers.length).toBe(6);
      expect(hiddenCustomers.length).toBe(3);

    });

    it('should process next last page partial, page 1 to page 3', () => {
      let paging: IPaging;
      paging = pagingService.initializePaging(3, 7, DEFAULT_PAGING_OPTIONS);
      paging.direction = ScrollDirection.NEXT;
      pagingService.processItems(displayItems, resultItemsPage2, paging);
      paging.direction = ScrollDirection.NEXT;
      pagingService.processItems(displayItems, partialResultItemsPage3, paging);

      expect(displayItems.length).toBe(7);
      expect(paging.viewWindowStartIndex).toBe(3);
      expect(paging.viewWindowEndIndex).toBe(7);
      expect(paging.page).toBe(3);
      let visibleCustomers: ICustomer[] = [];
      let hiddenCustomers: ICustomer[] = [];
      displayItems.forEach(x => {
        if (x.scrollVisibility === true && (x.customerName === '2' || x.customerName === '3')) {
          visibleCustomers.push(x);
        } else {
          hiddenCustomers.push(x);
        }
      });

      expect(visibleCustomers.length).toBe(4);
      expect(hiddenCustomers.length).toBe(3);
    });


    it('should process next, process previous full pages, page 1 to page 3', () => {
      let paging: IPaging;
      paging = pagingService.initializePaging(3, 9, DEFAULT_PAGING_OPTIONS);
      paging.direction = ScrollDirection.NEXT;
      pagingService.processItems(displayItems, resultItemsPage2, paging);
      paging.direction = ScrollDirection.NEXT;
      pagingService.processItems(displayItems, resultItemsPage3, paging);
      paging.direction = ScrollDirection.PREVIOUS;
      pagingService.processItems(displayItems, null, paging);
      expect(displayItems.length).toBe(9);
      expect(paging.viewWindowStartIndex).toBe(0);
      expect(paging.viewWindowEndIndex).toBe(6);
      expect(paging.page).toBe(2);
      let visibleCustomers: ICustomer[] = [];
      let hiddenCustomers: ICustomer[] = [];
      displayItems.forEach(x => {
        if (x.scrollVisibility === true && (x.customerName === '1' || x.customerName === '2')) {
          visibleCustomers.push(x);
        } else {
          hiddenCustomers.push(x);
        }
      });

      expect(visibleCustomers.length).toBe(6);
      expect(hiddenCustomers.length).toBe(3);
    });

    it('should process next, process previous partial last page, page 1 to page 3', () => {
      let paging: IPaging;
      paging = pagingService.initializePaging(3, 7, DEFAULT_PAGING_OPTIONS);
      paging.direction = ScrollDirection.NEXT;
      pagingService.processItems(displayItems, resultItemsPage2, paging);
      paging.direction = ScrollDirection.NEXT;
      pagingService.processItems(displayItems, partialResultItemsPage3, paging);
      paging.direction = ScrollDirection.PREVIOUS;
      pagingService.processItems(displayItems, null, paging);
      expect(displayItems.length).toBe(7);
      expect(paging.viewWindowStartIndex).toBe(0);
      expect(paging.viewWindowEndIndex).toBe(6);
      expect(paging.page).toBe(2);
      let visibleCustomers: ICustomer[] = [];
      let hiddenCustomers: ICustomer[] = [];
      displayItems.forEach(x => {
        if (x.scrollVisibility === true && (x.customerName === '1' || x.customerName === '2')) {
          visibleCustomers.push(x);
        } else {
          hiddenCustomers.push(x);
        }
      });

      expect(visibleCustomers.length).toBe(6);
      expect(hiddenCustomers.length).toBe(1);
    });

    it('should work with one partial page of results', () => {
      let paging: IPaging;
      displayItems.splice(1, 3);
      paging = pagingService.initializePaging(1, 1, DEFAULT_PAGING_OPTIONS);
      paging.direction = ScrollDirection.NEXT;
      pagingService.processItems(displayItems, null, paging);

      expect(displayItems.length).toBe(1);
      expect(paging.viewWindowStartIndex).toBe(0);
      expect(paging.viewWindowEndIndex).toBe(1);
      expect(paging.page).toBe(1);
      let visibleCustomers: ICustomer[] = [];
      let hiddenCustomers: ICustomer[] = [];
      displayItems.forEach(x => {
        if (x.scrollVisibility === true && (x.customerName === '1')) {
          visibleCustomers.push(x);
        } else {
          hiddenCustomers.push(x);
        }
      });

      expect(visibleCustomers.length).toBe(1);
      expect(hiddenCustomers.length).toBe(0);
    });
  });

  describe('reProcessItems', () => {
    let paging: IPaging;
    beforeEach(() => {
      paging = pagingService.initializePaging(3, 12, DEFAULT_PAGING_OPTIONS);
      paging.direction = ScrollDirection.NEXT;
      pagingService.processItems(displayItems, resultItemsPage2, paging);
      paging.direction = ScrollDirection.NEXT;
      pagingService.processItems(displayItems, resultItemsPage3, paging);
      paging.direction = ScrollDirection.NEXT;
      pagingService.processItems(displayItems, resultItemsPage4, paging);
      paging.direction = ScrollDirection.PREVIOUS;
      pagingService.processItems(displayItems, null, paging);
    });

    it('should change paging.totalCount and update visibility', () => {
      displayItems.splice(4, 1);
      pagingService.reProcessItems(displayItems, paging);

      expect(displayItems.length).toBe(11);
      expect(paging.totalCount).toBe(11);
      expect(paging.pagesRetrieved).toBe(4);
      let visibleCustomers: ICustomer[] = [];
      let hiddenCustomers: ICustomer[] = [];
      displayItems.forEach(x => {
        if (x.scrollVisibility === true) {
          visibleCustomers.push(x);
        } else {
          hiddenCustomers.push(x);
        }
      });

      expect(visibleCustomers.length).toBe(6);
      expect(hiddenCustomers.length).toBe(5);
    });

    it('should change paging.totalCount, visibility, and pagsRetrieved', () => {
      displayItems.splice(3, 1);
      pagingService.reProcessItems(displayItems, paging);
      displayItems.splice(3, 1);
      pagingService.reProcessItems(displayItems, paging);
      displayItems.splice(3, 1);
      pagingService.reProcessItems(displayItems, paging);

      expect(displayItems.length).toBe(9);
      expect(paging.totalCount).toBe(9);
      expect(paging.pagesRetrieved).toBe(3);
      expect(paging.viewWindowMaxStartIndex).toBe(3);
      let visibleCustomers: ICustomer[] = [];
      let hiddenCustomers: ICustomer[] = [];
      displayItems.forEach(x => {
        if (x.scrollVisibility === true) {
          visibleCustomers.push(x);
        } else {
          hiddenCustomers.push(x);
        }
      });

      expect(visibleCustomers.length).toBe(6);
      expect(hiddenCustomers.length).toBe(3);
    });
  });
});
