import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {Component, DebugElement, ViewChild} from '@angular/core';
import {HistoricalAttributeComponent} from './historical-attribute.component';
import {IHistoricalAttribute} from '../../interfaces/iHistoricalAttribute';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import { CommentListComponent } from 'app/comment/components/comment-list/comment-list.component';
import { CommentListItemComponent } from 'app/comment/components/comment-list-item/comment-list-item.component';
import { IComment } from 'app/comment/interfaces/iComment';
import {HistoricalAttributeItemStubComponent} from '../historical-attribute-item/historical-attribute-item.component.stub';

describe('HistoricalAttributeComponent', () => {
  let component: TestHistoricalAttributeComponent;
  let fixture: ComponentFixture<TestHistoricalAttributeComponent>;
  let historyAttribute: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule],
      declarations: [
        HistoricalAttributeComponent,
        HistoricalAttributeItemStubComponent,
        TestHistoricalAttributeComponent
      ]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(TestHistoricalAttributeComponent);
        component = fixture.componentInstance;
        historyAttribute = fixture.debugElement.query(By.css('.attribute'));
        fixture.detectChanges();
      });
  }));

  afterEach(() => {
    if (fixture) {
      fixture.destroy();
    }
  });

  describe('Historical Attribute', () => {
    it('historical-attribute class should be present', () => {
      expect(component.historicalAttribute.historicalAttributes).toBeTruthy();
    });
  });

  @Component({
    template: `
      <gpr-historical-attribute [historicalAttributes]="historicalAttributes"></gpr-historical-attribute>
    `
  })
  class TestHistoricalAttributeComponent {
    @ViewChild(HistoricalAttributeComponent) historicalAttribute;
    public historicalAttributes = [<IHistoricalAttribute>{
      attributeName: 'Test Attribute',
      attributeDescription: 'test description',
      userInfo: {
        firstName: 'Test',
        lastName: 'Name',
        emailAddress: 'test@metlife.com',
        metnetId: 'testtest'
      },
      lastUpdatedTimestamp: '9:00pm',
      comments: [<IComment>{
        commentId: 6264,
        text: 'Test Comment',
        lastUpdatedBy: 'Josh Returns',
        lastUpdatedByTimestamp: '05/21/17 3:00pm',
        lastUpdatedByEmail: 'jr@metlife.com'
      }]
    }];
  }
});
