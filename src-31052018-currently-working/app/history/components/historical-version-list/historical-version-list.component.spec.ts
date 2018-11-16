import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {Component, DebugElement, ViewChild} from '@angular/core';
import {HistoricalVersionListComponent} from './historical-version-list.component';
import {IHistoricalVersion} from '../../interfaces/iHistoricalVersion';
import { CommentListComponent } from 'app/comment/components/comment-list/comment-list.component';
import { CommentListItemComponent } from 'app/comment/components/comment-list-item/comment-list-item.component';
import {HistoricalAttributeStubComponent} from '../historical-attribute/historical-attribute.component.stub';
import {UserTooltipComponent} from '../../../core/components/user-tooltip/user-tooltip.component';
import {TooltipContentComponent} from '../../../ui-controls/components/tooltip/tooltip-content.component';
import {TooltipDirective} from '../../../ui-controls/components/tooltip/tooltip.directive';
import {IconComponent} from '../../../ui-controls/components/icon/icon.component';
import {TooltipPositionService} from '../../../ui-controls/services/tooltip-position.service';
import {TooltipService} from '../../../ui-controls/services/tooltip.service';


describe('HistoricalVersionListComponent', () => {
  let component: TestHistoricalVersionListComponent;
  let fixture: ComponentFixture<TestHistoricalVersionListComponent>;
  let historicalVersionList: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        HistoricalAttributeStubComponent,
        HistoricalVersionListComponent,
        IconComponent,
        TestHistoricalVersionListComponent,
        TooltipContentComponent,
        TooltipDirective,
        UserTooltipComponent],
      providers: [
        TooltipPositionService,
        TooltipService
      ]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(TestHistoricalVersionListComponent);
        component = fixture.componentInstance;
        historicalVersionList = fixture.debugElement.query(By.css('.historical-version-list'));
        fixture.detectChanges();
      });
  }));

  describe('Historical Version List', () => {
    it('version-title should be present', function () {
      const planName = historicalVersionList.query(By.css('.version-title'));
      expect(planName.nativeElement.innerHTML).toContain('Test Version');
    });

    it('version-details should be present', function () {
      const planDetails = historicalVersionList.query(By.css('.version-details'));
      expect(planDetails.nativeElement.innerHTML).toContain('testtest');
    });

    it('historical-version-list class should be present', () => {
      expect(component.historicalVersionList.historicalVersions).toBeTruthy();
    });
  });

  @Component({
    template: `
      <gpr-historical-version-list [historicalVersions]="historicalVersions"></gpr-historical-version-list>
    `
  })
  class TestHistoricalVersionListComponent {
    @ViewChild(HistoricalVersionListComponent) historicalVersionList;
    public historicalVersions = [<IHistoricalVersion>{
      versionName: 'Test Version',
      userInfo: {
        firstName: 'Test',
        lastName: 'Name',
        emailAddress: 'test@metlife.com',
        metnetId: 'testtest'
      },
      lastUpdatedTimestamp: '9:00pm',
      historicalAttributes: []
    }];
  }
});
