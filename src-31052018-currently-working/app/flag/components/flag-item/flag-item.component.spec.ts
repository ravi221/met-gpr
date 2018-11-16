import {async, ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import {FlagItemComponent} from './flag-item.component';
import {IconComponent} from '../../../ui-controls/components/icon/icon.component';
import {By} from '@angular/platform-browser';
import {Component, ViewChild} from '@angular/core';
import { EmailLinkComponent } from '../../../ui-controls/components/email-link/email-link.component';
import { IFlagsResponse } from 'app/flag/interfaces/iFlagsResponse';

describe('FlagItemComponent', () => {
  let component: FlagItemComponent;
  let fixture: ComponentFixture<FlagItemComponent>;
  let mockFlagResponse = <IFlagsResponse>{
    totalFlagCount: 9,
    plans: [{
      planId: '1',
      planName: 'Test Plan Name',
      flags: [{
        questionName: 'test',
        questionValue: 'question value',
        text: 'this is comment text',
        lastUpdatedBy: 'John Smith',
        lastUpdatedByEmail: 'js@metlife.com',
        lastUpdatedTimestamp: '02-12-2018 16:32:59.910'
      }]
    }]
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FlagItemComponent, IconComponent,
      EmailLinkComponent]
    })
      .compileComponents();
  }));

  afterEach(() => {
    if (fixture) {
      fixture.destroy();
    }
  });

  describe('Flags Test', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(FlagItemComponent);
      component = fixture.componentInstance;
      component.flag = mockFlagResponse.plans[0].flags[0];
      fixture.detectChanges();
    });

    it('should properly show flag title', () => {
      const content = fixture.debugElement.query(By.css('.flag-title'));
      expect(content.nativeElement.innerText).toBe('test: (question value)');
    });

    it('should properly show flag text', () => {
      const content = fixture.debugElement.query(By.css('.comment-text'));
      expect(content.nativeElement.innerText).toBe('this is comment text');
    });
    it('should emit on click', fakeAsync(() => {
      const spy = spyOn(component.flagResolve, 'emit').and.stub();
      component.onFlagResolve(component.flag);
      tick(1);
      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledWith(component.flag);
    }));
  });
});



