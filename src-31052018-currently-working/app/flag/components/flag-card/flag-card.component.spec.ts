import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {CardComponent} from 'app/ui-controls/components/card/card.component';
import {Component, ViewChild} from '@angular/core';
import {contextFlag, contextFlagResponse} from '../../../../assets/test/common-objects/flags.mock';
import {customerContext} from '../../../../assets/test/common-objects/navigation-objects';
import {DetailCardComponent} from '../../../ui-controls/components/detail-card/detail-card.component';
import {FlagCardComponent} from './flag-card.component';
import { FlagService } from 'app/flag/services/flag.service';
import {HttpClientModule} from '@angular/common/http';
import {IconComponent} from 'app/ui-controls/components/icon/icon.component';
import {LoadingIconComponent} from 'app/ui-controls/components/loading-icon/loading-icon.component';
import {NavigatorService} from '../../../navigation/services/navigator.service';
import {Observable} from 'rxjs/Observable';
import {RouterTestingModule} from '@angular/router/testing';
import {FlagResolverTooltipStubComponent} from '../flag-resolver-tooltip/flag-resolver-tooltip.component.stub';
import {MockNavigatorService} from '../../../navigation/services/navigator.service.mock';
import { ISummaryFlagsResponse } from '../../interfaces/iSummaryFlagsResponse';

describe('FlagCardComponent', () => {
  let component: TestFlagCardComponent;
  let fixture: ComponentFixture<TestFlagCardComponent>;
  let flagService: FlagService;

  class FlagServiceStub {
    getFlags() {
      return Observable.of(contextFlagResponse);
    }

    get update$() {
      return Observable.of([]);
    }
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, RouterTestingModule],
      declarations: [
        FlagCardComponent,
        FlagResolverTooltipStubComponent,
        TestFlagCardComponent,
        CardComponent,
        IconComponent,
        LoadingIconComponent,
        DetailCardComponent,
      ],
      providers: [
        {provide: NavigatorService, useClass: MockNavigatorService},
        {provide: FlagService, useClass: FlagServiceStub}
      ]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(TestFlagCardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        flagService = TestBed.get(FlagService);
      });

  }));

  afterEach(() => {
    if (fixture) {
      fixture.destroy();
    }
  });

  describe('See All link', () => {
    it('should display see all link when flag count is equal to three', () => {
      let newContextFlagResponse = contextFlagResponse;
      newContextFlagResponse.totalFlagCount = 3;
      newContextFlagResponse.flags = [contextFlag, contextFlag, contextFlag];

      const spy = spyOn(flagService, 'getFlags').and.returnValue(Observable.of(newContextFlagResponse));
      component.flagCard.ngOnInit();
      fixture.detectChanges();

      const showAllLink = fixture.debugElement.query(By.css('.see-all-link'));
      expect(showAllLink).toBeTruthy();
      expect(spy).toHaveBeenCalled();
    });

    it('should display see all link when flag count is greater than three', () => {
      let newContextFlagResponse = contextFlagResponse;
      newContextFlagResponse.totalFlagCount = 4;
      newContextFlagResponse.flags = [contextFlag, contextFlag, contextFlag, contextFlag];

      const spy = spyOn(flagService, 'getFlags').and.returnValue(Observable.of(newContextFlagResponse));
      component.flagCard.ngOnInit();
      fixture.detectChanges();

      const showAllLink = fixture.debugElement.query(By.css('.see-all-link'));
      expect(showAllLink).toBeTruthy();
      expect(spy).toHaveBeenCalled();

    });

    it('should display see all link when flag count is zero', () => {
      let newContextFlagResponse = contextFlagResponse;
      newContextFlagResponse.totalFlagCount = 0;
      newContextFlagResponse.flags = [];

      const spy = spyOn(flagService, 'getFlags').and.returnValue(Observable.of(newContextFlagResponse));
      component.flagCard.ngOnInit();
      fixture.detectChanges();

      const showAllLink = fixture.debugElement.query(By.css('.see-all-link'));
      expect(showAllLink).toBeNull();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('Flag Heading', () => {
    it('should display \'Customer Flags\' when there is not a plan id or category id', () => {
      expect(component.flagCard.flagsHeading).toBe('Customer Flags');
    });

    it('should display \'Plan Flags\' when there is a customer number and plan id, but no category id', () => {
      component.planId = '1';
      component.categoryId = null;
      fixture.detectChanges();
      component.flagCard.ngOnInit();

      expect(component.flagCard.flagsHeading).toBe('Plan Flags');
    });

    it('should display \'Category Flags\' when there is a customer number, plan id and category id', () => {
      component.planId = '1';
      component.categoryId = '1';
      fixture.detectChanges();
      component.flagCard.ngOnInit();

      expect(component.flagCard.flagsHeading).toContain('Category Flags');
    });
  });

  describe('Displaying card', () => {
    it('should not display the flag card when the flag count is zero', () => {
      let newContextFlagResponse = contextFlagResponse;
      newContextFlagResponse.totalFlagCount = 0;
      newContextFlagResponse.flags = [];

      const spy = spyOn(flagService, 'getFlags').and.returnValue(Observable.of(newContextFlagResponse));
      component.flagCard.ngOnInit();
      fixture.detectChanges();

      const flagsCard = fixture.debugElement.query(By.css('.flags-container'));
      expect(flagsCard).toBeNull();
      expect(component.flagCard.hasFlags).toBeFalsy();
      expect(spy).toHaveBeenCalled();
    });

    it('should display the flag card when the flag count is greater than zero', () => {
      let newContextFlagResponse = contextFlagResponse;
      newContextFlagResponse.totalFlagCount = 1;
      newContextFlagResponse.flags = [contextFlag];

      const spy = spyOn(flagService, 'getFlags').and.returnValue(Observable.of(newContextFlagResponse));
      component.flagCard.ngOnInit();
      fixture.detectChanges();

      const flagsCard = fixture.debugElement.query(By.css('.flags-container'));
      expect(flagsCard).toBeTruthy();
      expect(component.flagCard.hasFlags).toBeTruthy();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('Updating card', () => {

    it('should display the flag card when the flag count is updated', () => {
      const spy = spyOn(component.flagCard, 'updateFlags').and.callThrough();
      component.flagCard.ngOnInit();
      expect(spy).toHaveBeenCalled();
    });
  });


  @Component({
    template: `
      <gpr-flag-card [customer]="customer" [planId]="planId" [categoryId]="categoryId"></gpr-flag-card>
    `
  })
  class TestFlagCardComponent {
    @ViewChild(FlagCardComponent) flagCard;
    public customer = customerContext.data.customer;
    public planId = null;
    public categoryId = null;
  }
});
