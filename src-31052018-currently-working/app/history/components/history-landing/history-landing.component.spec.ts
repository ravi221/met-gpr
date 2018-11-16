import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {CardComponent} from '../../../ui-controls/components/card/card.component';
import {customerContext} from '../../../../assets/test/common-objects/navigation-objects';
import {DatePickerComponent} from '../../../ui-controls/components/date-picker/date-picker.component';
import {FilterLinkService} from '../../../core/services/filter-link.service';
import {FilterService} from '../../../core/services/filter.service';
import {FormsModule} from '@angular/forms';
import {HistoryFilterService} from '../../services/history-filter.service';
import {HistoryLandingComponent} from './history-landing.component';
import {HistoryService} from '../../services/history.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {HttpClient} from '@angular/common/http';
import {ICustomer} from '../../../customer/interfaces/iCustomer';
import {IHistoricalPlan} from '../../interfaces/iHistoricalPlan';
import {IHistoryRequestParam} from '../../interfaces/iHistoryRequestParam';
import {Injectable} from '@angular/core';
import {LoadingIconComponent} from '../../../ui-controls/components/loading-icon/loading-icon.component';
import {NavigatorService} from '../../../navigation/services/navigator.service';
import {Observable} from 'rxjs/Observable';
import {OutsideClickDirective} from '../../../ui-controls/directives/outside-click.directive';
import {RouterTestingModule} from '@angular/router/testing';
import {SortOptionsService} from '../../../core/services/sort-options.service';
import {UserPreferencesService} from '../../../core/services/user-preferences.service';
import {UserProfileService} from '../../../core/services/user-profile.service';
import {FilterBarStubComponent} from '../../../core/components/filter-bar/filter-bar.component.stub';
import {DropDownComponent} from '../../../forms-controls/components/drop-down/drop-down.component';
import {HistoricalPlanListStubComponent} from '../historical-plan-list/historical-plan-list.component.stub';
import {HistoryHeadingStubComponent} from '../history-heading/history-heading.component.stub';
import {HistoryFilterStubComponent} from '../history-filter/history-filter.component.stub';

describe('HistoryLandingComponent', () => {
  let component: HistoryLandingComponent;
  let fixture: ComponentFixture<HistoryLandingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        FormsModule,
        HttpClientTestingModule
      ],
      declarations: [
        CardComponent,
        DatePickerComponent,
        DropDownComponent,
        FilterBarStubComponent,
        HistoricalPlanListStubComponent,
        HistoryFilterStubComponent,
        HistoryHeadingStubComponent,
        HistoryLandingComponent,
        LoadingIconComponent,
        OutsideClickDirective,
      ],
      providers: [
        FilterLinkService,
        FilterService,
        HistoryFilterService,
        SortOptionsService,
        UserPreferencesService,
        UserProfileService,
        {provide: HistoryService, useClass: MockHistoryService},
        {provide: NavigatorService, useClass: MockNavigatorService},
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoryLandingComponent);
    component = fixture.componentInstance;
    component.customer = <ICustomer>{customerName: 'Test Customer', customerNumber: 1111111};
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('History Landing Page', () => {
    it('should properly show page name', () => {
      const pageName = fixture.debugElement.query(By.css('.banner h4 strong'));
      expect(pageName.nativeElement.innerText).toBe('History');
    });
  });

  describe('Filter testing', () => {

    it('should select chosen coverages', () => {
      const coverages = {
        coverages: [{id: '203000', name: 'STD'},
          {id: '203003', name: 'NYDBL-STATUTORY'}]
      };
      component.onFilterChange(coverages);
      expect(component.chosenCoverageIDs).toEqual(['203000', '203003']);
    });
  });

  class MockNavigatorService {

    goToHistoryHome() {
    }

    subscribe(name: string, handler: any) {
      return customerContext;
    }

    unsubscribe(name: string) {
    }

  }

  @Injectable()
  class MockHistoryService {
    constructor(private _http: HttpClient) {
    }

    public getPublishedHistory(historyRequest: IHistoryRequestParam): Observable<IHistoricalPlan[]> {
      return this._http.get<Array<IHistoricalPlan>>('assets/test/history/historicalPlan.json', {headers: {'X-Mock-Request': ''}});
    }
  }

});
