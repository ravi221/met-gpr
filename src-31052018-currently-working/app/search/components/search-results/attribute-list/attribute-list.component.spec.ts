import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {SearchAttributeListComponent} from './attribute-list.component';
import {Component, ViewChild} from '@angular/core';
import {By} from '@angular/platform-browser';
import {SearchResultComponent} from '../search-result/search-result.component';
import {IconComponent} from '../../../../ui-controls/components/icon/icon.component';
import {SearchResultTitleComponent} from '../search-result-title/search-result-title.component';
import {SearchAttributeListItemComponent} from '../attribute-list-item/attribute-list-item.component';
import {SearchResultTitleService} from '../../../services/search-result-title.service';

describe('SearchAttributeListComponent', () => {
  let component: TestSearchAttributeListComponent;
  let fixture: ComponentFixture<TestSearchAttributeListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        TestSearchAttributeListComponent,
        SearchAttributeListComponent,
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
        fixture = TestBed.createComponent(TestSearchAttributeListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
      });
  }));

  afterEach(() => {
    if (fixture) {
      fixture.destroy();
    }
  });

  it('should render 3 attributes search results', () => {
    const attributes = fixture.debugElement.queryAll(By.css('.search-attribute-list'));
    expect(attributes.length).toBeTruthy();
  });

  it('should emit an attribute when an attribute\'s plans is clicked', () => {
    const attribute = component.attributes[0];
    const spy = spyOn(component, 'onAttributeDetails').and.stub();
    component.attributeList.onAttributeDetailsClick(attribute);
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith(attribute);
  });

  @Component({
    template: `
      <gpr-search-attribute-list [attributes]="attributes"
                                 (attributeDetailsClick)="onAttributeDetails($event)"></gpr-search-attribute-list>
    `
  })
  class TestSearchAttributeListComponent {
    @ViewChild(SearchAttributeListComponent) attributeList;
    attributes = [
      {planIds: ['1'], attributeName: 'Test Attribute Name 1', attributeValue: '1'},
      {planIds: ['2'], attributeName: 'Test Attribute Name 2', attributeValue: '1'},
      {planIds: ['3'], attributeName: 'Test Attribute Name 3', attributeValue: '1'},
    ];
    onAttributeDetails(e) {

    }
  }
});
