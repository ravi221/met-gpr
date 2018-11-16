import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MassUpdateSelectPlansTooltipComponent } from './mass-update-select-plans-tooltip.component';
import {Component} from '@angular/core';
import {By} from '@angular/platform-browser';
import {TooltipService} from 'app/ui-controls/services/tooltip.service';
import {TooltipPositionService} from 'app/ui-controls/services/tooltip-position.service';
import {TooltipContentComponent} from 'app/ui-controls/components/tooltip/tooltip-content.component';
import {TooltipDirective} from 'app/ui-controls/components/tooltip/tooltip.directive';
import {TooltipHoverDirective} from 'app/ui-controls/components/tooltip/tooltip-hover.directive';
import {IconComponent} from 'app/ui-controls/components/icon/icon.component';
import {click} from 'assets/test/TestHelper';
import {MassUpdateDataService} from 'app/plan/mass-update/services/mass-update-data.service';
import {MockUserProfileService} from 'app/core/services/user-profile-service-mock';
import {UserProfileService} from 'app/core/services/user-profile.service';
import {PageAccessService} from 'app/core/services/page-access.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('MassUpdateSelectPlansTooltipComponent', () => {
  let component: MassUpdateSelectPlansTooltipComponent;
  let fixture: ComponentFixture<MassUpdateSelectPlansTooltipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [
        MassUpdateSelectPlansTooltipComponent,
        TooltipContentComponent,
        TooltipDirective,
        TooltipHoverDirective,
        IconComponent
      ],
      providers: [
        TooltipService,
        TooltipPositionService,
        MassUpdateDataService,
        PageAccessService,
        {provide: UserProfileService, useClass: MockUserProfileService}
      ]
    })
    .compileComponents();
  }));


  beforeEach(() => {
    fixture = TestBed.createComponent(MassUpdateSelectPlansTooltipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
