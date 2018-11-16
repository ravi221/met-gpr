import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {SearchAttributeDetailsListComponent} from './attribute-details-list.component';
import {Component} from '@angular/core';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {SearchResultComponent} from '../search-result/search-result.component';
import {IconComponent} from '../../../../ui-controls/components/icon/icon.component';
import {SearchResultTitleComponent} from '../search-result-title/search-result-title.component';
import {SearchService} from '../../../services/search.service';
import {AttributeSearchService} from '../../../services/attribute-search.service';
import {CustomerSearchService} from '../../../services/customer-search.service';
import {PlanSearchService} from '../../../services/plan-search.service';
import {SearchAttributeDetailsListItemComponent} from '../attribute-details-list-item/attribute-details-list-item.component';
import {DateService} from '../../../../core/services/date.service';
import {SearchResultTitleService} from '../../../services/search-result-title.service';
import {By} from '@angular/platform-browser';

describe('SearchAttributeDetailsListComponent', () => {
  let component: TestSearchAttributeDetailsListComponent;
  let fixture: ComponentFixture<TestSearchAttributeDetailsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        TestSearchAttributeDetailsListComponent,
        SearchAttributeDetailsListComponent,
        SearchAttributeDetailsListItemComponent,
        SearchResultComponent,
        IconComponent,
        SearchResultTitleComponent
      ],
      providers: [
        SearchResultTitleService
      ]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(TestSearchAttributeDetailsListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
      });
  }));

  afterEach(() => {
    if (fixture) {
      fixture.destroy();
    }
  });

  it('should display a list of attribute details', () => {
    const attributeDetailsList = fixture.debugElement.queryAll(By.css('.search-attribute-details'));
    expect(attributeDetailsList.length).toBe(2);
  });

  @Component({
    template: `
      <gpr-search-attribute-details-list [attributeDetails]="attributeDetails"></gpr-search-attribute-details-list>`
  })
  class TestSearchAttributeDetailsListComponent {
    attributeDetails = [
      {
        planIds: [],
        attributeName: 'Test Attribute Name 1',
        attributeValue: '01/01/2017'
      },
      {
        planIds: [],
        attributeName: 'Test Attribute Name 2',
        attributeValue: '01/01/2017'
      }
    ];
  }
});
