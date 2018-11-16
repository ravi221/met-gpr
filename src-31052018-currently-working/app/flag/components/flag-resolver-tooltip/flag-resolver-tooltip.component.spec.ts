import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {FlagResolverTooltipComponent} from './flag-resolver-tooltip.component';
import {planContext} from '../../../../assets/test/common-objects/navigation-objects';
import {Component, NgModule, ViewChild} from '@angular/core';
import {ModalService} from '../../../ui-controls/services/modal.service';
import {FlagResolverPopupComponent} from '../flag-resolver-popup/flag-resolver-popup.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { IconComponent } from '../../../ui-controls/components/icon/icon.component';
import { TooltipContentComponent } from '../../../ui-controls/components/tooltip/tooltip-content.component';
import { TooltipDirective } from '../../../ui-controls/components/tooltip/tooltip.directive';
import { TooltipService } from '../../../ui-controls/services/tooltip.service';
import { TooltipPositionService } from '../../../ui-controls/services/tooltip-position.service';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { ModalContainerComponent } from '../../../ui-controls/components/modal/modal-container/modal-container.component';
import { ModalBackdropComponent } from '../../../ui-controls/components/modal/modal-backdrop/modal-backdrop.component';
import { CustomerStatus } from 'app/customer/enums/customer-status';


describe('FlagResolverTooltipComponent', () => {
  let component: FlagResolverTooltipComponent;
  let fixture: ComponentFixture<FlagResolverTooltipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [TooltipDirective,
        TooltipContentComponent,
        FlagResolverTooltipComponent,
        FlagResolverPopupComponent,
        IconComponent,
        TooltipContentComponent,
        ModalContainerComponent,
        ModalBackdropComponent
      ],
      providers: [ModalService, TooltipService, TooltipPositionService]
    });
    TestBed.overrideModule(BrowserDynamicTestingModule, {
      set: {
        entryComponents: [ModalContainerComponent, ModalBackdropComponent]
      }
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlagResolverTooltipComponent);
    component = fixture.componentInstance;
    component.flag = {
      questionId: '1',
      questionName: 'question name',
      questionValue: 'question value',
      lastUpdatedBy: 'srajagopalan1',
      lastUpdatedByEmail: 'srajagop@metlife.com',
      lastUpdatedTimestamp: '',
      isResolved: false,
      text: 'flag text'
    };
    component.customer = {
      customerName: 'Test Customer',
      customerNumber: 1234,
      effectiveDate: null,
      status: CustomerStatus.UNAPPROVED,
      percentageCompleted: 50,
      market: 'Small Market',
      hiddenStatus: false,
      scrollVisibility: true
    };
    fixture.detectChanges();
  });

  afterEach(() => {
    if (fixture) {
      fixture.destroy();
    }
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

