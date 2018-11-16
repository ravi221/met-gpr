import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {Component, DebugElement, ViewChild} from '@angular/core';
import {HistoricalAttributeItemComponent} from './historical-attribute-item.component';
import {IHistoricalAttribute} from '../../interfaces/iHistoricalAttribute';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import { CommentListComponent } from 'app/comment/components/comment-list/comment-list.component';
import { CommentListItemComponent } from 'app/comment/components/comment-list-item/comment-list-item.component';
import { IComment } from 'app/comment/interfaces/iComment';
import {HistoricalAttributeStubComponent} from '../historical-attribute/historical-attribute.component.stub';
import {HistoryService} from '../../services/history.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {MockHistoryService} from '../../services/history.service.mock';
import {UserTooltipComponent} from '../../../core/components/user-tooltip/user-tooltip.component';
import {TooltipContentComponent} from '../../../ui-controls/components/tooltip/tooltip-content.component';
import {TooltipDirective} from '../../../ui-controls/components/tooltip/tooltip.directive';
import {IconComponent} from '../../../ui-controls/components/icon/icon.component';
import {TooltipPositionService} from '../../../ui-controls/services/tooltip-position.service';
import {TooltipService} from '../../../ui-controls/services/tooltip.service';

describe('HistoricalAttributeItemComponent', () => {
  let component: TestHistoricalAttributeItemComponent;
  let fixture: ComponentFixture<TestHistoricalAttributeItemComponent>;
  let historyAttribute: DebugElement;
  let historyService: HistoryService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        NoopAnimationsModule,
      ],
      declarations: [
        CommentListComponent,
        CommentListItemComponent,
        HistoricalAttributeStubComponent,
        HistoricalAttributeItemComponent,
        IconComponent,
        TestHistoricalAttributeItemComponent,
        TooltipContentComponent,
        TooltipDirective,
        UserTooltipComponent
      ],
      providers: [
        TooltipPositionService,
        TooltipService,
        {provide: HistoryService, useClass: MockHistoryService},
      ]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(TestHistoricalAttributeItemComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        historyAttribute = fixture.debugElement.query(By.css('.attribute'));
        historyService = TestBed.get(HistoryService);
      });
  }));

  afterEach(() => {
    if (fixture) {
      fixture.destroy();
    }
  });

  describe('Historical Attribute Item', () => {
    it('attribute-title should be present', function () {
      const attributeTitle = historyAttribute.query(By.css('.attribute-title'));
      expect(attributeTitle.nativeElement.innerHTML).toContain('Test Attribute');
    });

    it('attribute-description should be present', function () {
      const attributeDescription = historyAttribute.query(By.css('.attribute-description'));
      expect(attributeDescription.nativeElement.innerHTML).toContain('test description');
    });

    it('attribute-details should be present', function () {
      const attributeDetails = historyAttribute.query(By.css('.attribute-details'));
      expect(attributeDetails.nativeElement).toBeTruthy();
    });
  });

  @Component({
    template: `
      <gpr-historical-attribute-item [attribute]="historicalAttributeItem"></gpr-historical-attribute-item>
    `
  })
  class TestHistoricalAttributeItemComponent {
    @ViewChild(HistoricalAttributeItemComponent) historicalAttribute;
    public historicalAttributeItem = <IHistoricalAttribute>{
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
    };
  }
});
