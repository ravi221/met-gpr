import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MassUpdateSelectPlansToolbarComponent } from './mass-update-select-plans-toolbar.component';
import {Component} from '@angular/core';
import {By} from '@angular/platform-browser';
import {TooltipService} from 'app/ui-controls/services/tooltip.service';
import {TooltipPositionService} from 'app/ui-controls/services/tooltip-position.service';
import {TooltipContentComponent} from 'app/ui-controls/components/tooltip/tooltip-content.component';
import {TooltipDirective} from 'app/ui-controls/components/tooltip/tooltip.directive';
import {TooltipHoverDirective} from 'app/ui-controls/components/tooltip/tooltip-hover.directive';
import {IconComponent} from 'app/ui-controls/components/icon/icon.component';
import {click} from 'assets/test/TestHelper';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {MassUpdateDataService} from 'app/plan/mass-update/services/mass-update-data.service';
import {MockUserProfileService} from 'app/core/services/user-profile-service-mock';
import {UserProfileService} from 'app/core/services/user-profile.service';
import {PageAccessService} from 'app/core/services/page-access.service';



describe('MassUpdateSelectPlansToolbarComponent', () => {
  let component: MassUpdateSelectPlansToolbarComponent;
  let fixture: ComponentFixture<MassUpdateSelectPlansToolbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [
        MassUpdateSelectPlansToolbarComponent,
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
    fixture = TestBed.createComponent(MassUpdateSelectPlansToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Should not emit an event when select plan button is disabled', () => {
    component.canSelectPlans = false;
    const spy = spyOn(component.handleSelectPlansModal, 'emit');
    let button = fixture.debugElement.query(By.css('.btn.btn-secondary'));
    click(button);
    expect(component.handleSelectPlansModal.emit).toHaveBeenCalled();
  });

  it('When the select plans is disabled, there will be an error message that says "Please select at least one"', () => {
    component.canSelectPlans = false;
    const errorMessage = fixture.debugElement.query(By.css('.mass-update-tooltip-msg'));
    expect(errorMessage).toBeTruthy();
    expect(errorMessage.nativeElement.innerHTML).toBe('Please select at least one');
  });

  it('Should emit an event when select plan button is enabled', async(() => {
    component.canSelectPlans = true;
    spyOn(component, 'openModal');
    let button = fixture.debugElement.query(By.css('.btn.btn-secondary'));
    click(button);
    fixture.whenStable().then(() => {
      expect(component.openModal).toHaveBeenCalled();
    });
  }));
});
