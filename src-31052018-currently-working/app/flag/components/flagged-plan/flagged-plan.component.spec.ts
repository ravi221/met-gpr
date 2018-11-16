import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {FlaggedPlanComponent} from './flagged-plan.component';
import {IFlaggedPlan} from '../../interfaces/iFlaggedPlan';
import {Component, CUSTOM_ELEMENTS_SCHEMA, ViewChild} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {CardComponent} from '../../../ui-controls/components/card/card.component';
import { By } from '@angular/platform-browser';
import { FilterService } from '../../../core/services/filter.service';
import { FlagItemComponent } from '../flag-item/flag-item.component';
import { LoadingIconComponent } from '../../../ui-controls/components/loading-icon/loading-icon.component';
import { EmailLinkComponent } from '../../../ui-controls/components/email-link/email-link.component';
import { IconComponent } from '../../../ui-controls/components/icon/icon.component';
import { FlagService } from 'app/flag/services/flag.service';
import { IFlag } from 'app/flag/interfaces/iFlag';
import { IFlagsResponse } from 'app/flag/interfaces/iFlagsResponse';

describe('FlaggedPlanComponent', () => {
  let component: FlaggedPlanComponent;
  let fixture: ComponentFixture<FlaggedPlanComponent>;
  let filterService: FilterService;
  let mockFlagResponse = <IFlagsResponse>{
    totalFlagCount: 9,
    plans: [{
      planId: '1',
      planName: 'Test Plan Name',
      flags: [{
        questionName: 'test',
        questionValue: 'question value',
        text: 'comment',
        lastUpdatedBy: 'John Smith',
        lastUpdatedByEmail: 'js@metlife.com',
        lastUpdatedTimestamp: '02-12-2018 16:32:59.910',
        isResolved: false
      }]
    }]
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [],
      declarations: [
        FlaggedPlanComponent,
        CardComponent,
        FlagItemComponent,
        LoadingIconComponent,
        EmailLinkComponent,
        IconComponent
      ],
      providers: [
        FilterService,
        {provide: FlagService, useClass: MockFlagService}
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlaggedPlanComponent);
    component = fixture.componentInstance;
    component.plan = mockFlagResponse.plans[0];
    fixture.detectChanges();
    filterService = TestBed.get(FilterService);
  });

  afterEach(() => {
    if (fixture) {
      fixture.destroy();
    }
  });

  it('should properly show plan name as title', () => {
    const planName = fixture.debugElement.query(By.css('.card-title'));
    expect(planName.nativeElement.innerText).toBe('Test Plan Name');
  });

  class MockFlagService {
    getFlags(planTag: IFlaggedPlan): IFlag[] {
      return mockFlagResponse.plans[0].flags;
    }
  }

});



