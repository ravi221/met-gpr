import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {SearchAttributeDetailsListItemComponent} from './attribute-details-list-item.component';
import {Component, DebugElement, ViewChild} from '@angular/core';
import {By} from '@angular/platform-browser';
import {SearchResultComponent} from '../search-result/search-result.component';
import {IconComponent} from '../../../../ui-controls/components/icon/icon.component';
import {SearchResultTitleComponent} from '../search-result-title/search-result-title.component';
import {SearchService} from '../../../services/search.service';
import {AttributeSearchService} from '../../../services/attribute-search.service';
import {CustomerSearchService} from '../../../services/customer-search.service';
import {PlanSearchService} from '../../../services/plan-search.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {DateService} from '../../../../core/services/date.service';
import {SearchResultTitleService} from '../../../services/search-result-title.service';

describe('SearchAttributeDetailsListItemComponent', () => {
  let component: TestSearchAttributeDetailsListItemComponent;
  let fixture: ComponentFixture<TestSearchAttributeDetailsListItemComponent>;
  let planAttributeItem: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        TestSearchAttributeDetailsListItemComponent,
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
        fixture = TestBed.createComponent(TestSearchAttributeDetailsListItemComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        planAttributeItem = fixture.debugElement.query(By.css('.search-attribute-details'));
      });
  }));

  afterEach(() => {
    if (fixture) {
      fixture.destroy();
    }
  });

  it('should render correctly', () => {
    const planName = planAttributeItem.query(By.css('.plan-name')).nativeElement.innerHTML;
    const effectiveDate = planAttributeItem.query(By.css('.effective-date')).nativeElement.innerHTML;
    const attributeLabel = planAttributeItem.query(By.css('.search-result-title span:first-child')).nativeElement.innerHTML;
    const attributeValue = planAttributeItem.query(By.css('.search-result-subtitle')).nativeElement.innerHTML;

    expect(planName).toBe('Test Plan Name');
    expect(effectiveDate).toBe('Effective: 01/01/2017');
    expect(attributeLabel).toBe('Test Attribute Name');
    expect(attributeValue).toBe('value');
  });

  it('should (No Selection) when there is not an attribute value', () => {
    component.attributeDetails = {
      planName: 'Test Plan Name',
      attributeLabel: 'Test Attribute Name',
      attributeValue: '',
      effectiveDate: '01/01/2017'
    };
    fixture.detectChanges();
    const attribute = planAttributeItem.query(By.css('.search-result-subtitle'));
    expect(attribute.nativeElement.innerHTML).toBe('(No Selection)');
  });

  @Component({
    template: '<gpr-search-attribute-details-list-item [attributeDetails]="attributeDetails"></gpr-search-attribute-details-list-item>'
  })
  class TestSearchAttributeDetailsListItemComponent {
    public attributeDetails = {
      planName: 'Test Plan Name',
      attributeLabel: 'Test Attribute Name',
      attributeValue: 'value',
      effectiveDate: '01/01/2017'
    };
    @ViewChild(SearchAttributeDetailsListItemComponent) planAttribute;
  }
});
