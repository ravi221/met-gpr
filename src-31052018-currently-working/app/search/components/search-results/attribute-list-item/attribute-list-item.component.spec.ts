import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {Component, DebugElement, ViewChild} from '@angular/core';
import {By} from '@angular/platform-browser';
import {SearchAttributeListItemComponent} from './attribute-list-item.component';
import {SearchResultComponent} from '../search-result/search-result.component';
import {IconComponent} from '../../../../ui-controls/components/icon/icon.component';
import {SearchResultTitleComponent} from '../search-result-title/search-result-title.component';
import {SearchResultTitleService} from '../../../services/search-result-title.service';
import {click} from '../../../../../assets/test/TestHelper';

describe('SearchAttributeListItemComponent', () => {
  let component: TestSearchAttributeListItemComponent;
  let fixture: ComponentFixture<TestSearchAttributeListItemComponent>;
  let searchResult: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        TestSearchAttributeListItemComponent,
        SearchAttributeListItemComponent,
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
        fixture = TestBed.createComponent(TestSearchAttributeListItemComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        searchResult = fixture.debugElement.query(By.css('.search-result'));
      });
  }));

  afterEach(() => {
    if (fixture) {
      fixture.destroy();
    }
  });

  it('should setup the attribute search result correctly', () => {
    const icon = searchResult.query(By.css('img'));
    const title = searchResult.query(By.css('.search-result-title span:first-child'));
    expect(icon.nativeElement.src).toContain('plandoc-icon');
    expect(title.nativeElement.innerHTML).toBe('Test Attribute Name');
  });

  it('should trigger the attribute click event when the attribute is clicked', () => {
    const spy = spyOn(component, 'onAttribute').and.stub();
    click(searchResult, fixture);
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith(component.attribute);
  });

  it('should trigger the attribute details click event when the attribute is clicked', () => {
    const spy = spyOn(component, 'onAttributeDetails').and.stub();
    const plansButton = fixture.debugElement.query(By.css('.btn-more-info'));
    click(plansButton, fixture);
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith(component.attribute);
  });

  @Component({
    template: `
      <gpr-search-attribute-list-item [attribute]="attribute"
                                      (attributeClick)="onAttribute($event)"
                                      (attributeDetailsClick)="onAttributeDetails($event)"></gpr-search-attribute-list-item>
    `
  })
  class TestSearchAttributeListItemComponent {
    @ViewChild(SearchAttributeListItemComponent) attributeListItem;

    attribute = {
      planIds: [],
      attributeLabel: 'Test Attribute Name',
      attributeValue: '01/01/2017'
    };

    onAttribute(e) {

    }

    onAttributeDetails(e) {

    }

  }
});
