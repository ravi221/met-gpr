import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MassUpdateSelectPlanComponent } from './mass-update-select-plan.component';
import {By} from '@angular/platform-browser';
import {AnimationState} from 'app/ui-controls/animations/AnimationState';
import {click} from 'assets/test/TestHelper';
import {DebugElement, Component} from '@angular/core';
import {MassUpdateDataService} from 'app/plan/mass-update/services/mass-update-data.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {MockUserProfileService} from 'app/core/services/user-profile-service-mock';
import {UserProfileService} from 'app/core/services/user-profile.service';
import {PageAccessService} from 'app/core/services/page-access.service';
import {NavigatorService} from 'app/navigation/services/navigator.service';
import {MockNavigatorService} from 'app/navigation/services/navigator.service.mock';
import {Subscription} from 'rxjs/Subscription';
import {INavState} from 'app/navigation/interfaces/iNavState';
import {LoadingSpinnerService} from 'app/ui-controls/services/loading-spinner.service';
import {getNavStateForDataManager} from 'assets/test/NavStateHelper';
import * as data from 'assets/test/dynamic-form/data-manager.mock.json';
import {FormsModule} from '@angular/forms';
import {ExpandCollapseIconComponent} from 'app/ui-controls/components/expand-collapse-icon/expand-collapse-icon.component';
import {CardStubComponent} from 'app/ui-controls/components/card/card.component.stub';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {ActiveModalRef} from '../../../ui-controls/classes/modal-references';

describe('MassUpdateSelectPlanComponent', () => {
  let component: TestMassUpdateSelectPlanComponent;
  let fixture: ComponentFixture<TestMassUpdateSelectPlanComponent>;
  let subscription: Subscription;
  let collapseBtn: DebugElement;

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule, FormsModule, NoopAnimationsModule],
      declarations: [ MassUpdateSelectPlanComponent, ExpandCollapseIconComponent, CardStubComponent , TestMassUpdateSelectPlanComponent ],
      providers: [
        MassUpdateDataService,
        LoadingSpinnerService,
        {provide: UserProfileService, useClass: MockUserProfileService},
        {provide: NavigatorService, useClass: MockNavigatorService},
        PageAccessService,
        NavigatorService,
        {provide: ActiveModalRef, useClass: MockActiveModal}, ]
    })
    .compileComponents()
    .then(() => {
        fixture = TestBed.createComponent(TestMassUpdateSelectPlanComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
       collapseBtn = fixture.debugElement.query(By.css('.expand-collapse-icon')); 
      });
  }));

  afterEach(() => {
   if (fixture) {
     fixture.destroy();
   }
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  it('should check checkbox if checked is true', async(() => {
    component.selectAllPlans = true;
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      const inEl = fixture.debugElement.query(By.css('.select-all-checkbox'));
      expect(inEl.nativeElement.children[0].checked).toBe(true);
    });
  }));

  it('should check checkbox if checked is false', async(() => {
    component.selectAllPlans = false;
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      const inEl = fixture.debugElement.query(By.css('.select-all-checkbox'));
      expect(inEl.nativeElement.children[0].checked).toBe(false);
    });
  }));

  it('should CALL isSelectAllPlans funtion', () => {
    const expected = component.selectAllPlans;  
    const spy = spyOn(component, 'isSelectAllPlans').and.stub();
    component.isSelectAllPlans(expected);
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith(expected);
  });

   it('should check for the text', () => {
    const inEl = fixture.debugElement.query(By.css('.select-all-checkbox')).nativeElement;
    let expected = " Select All Plans";
    fixture.detectChanges();
    expect(inEl.innerText).toBe(expected);
  });
  
   it('should CALL getSelectedPlanNames funtion', () => {
    //const expected = component.selectAllPlans;  
    const spy = spyOn(component, 'getSelectedPlanNames').and.stub();
    component.getSelectedPlanNames();
    expect(spy).toHaveBeenCalled();
   // expect(spy).toHaveBeenCalledWith(expected);
  });

    it('should CALL togglePlansVisibility funtion', () => {
    const expected = component.isExpanded;
    const expectedNew = component.productAnimateLabel; 
    const spy = spyOn(component, 'togglePlansVisibility').and.stub();
    component.togglePlansVisibility(expected, expectedNew);
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith(expected, expectedNew);
  });

 it('should toggle between showing and hiding plan detail', () => {
   expect(component.sectionVisibilityState).toBe(AnimationState.VISIBLE);
   click(collapseBtn, fixture);
   expect(component.sectionVisibilityState).toBe(AnimationState.HIDDEN);
   click(collapseBtn, fixture);
   expect(component.sectionVisibilityState).toBe(AnimationState.VISIBLE);
 });
  
  
  @Component({
    template: `
	  <div class="checkbox-control select-all-checkbox" >
        <input id="select-plan-checkbox" type="checkbox" 
        [(ngModel)]="selectAllPlans" (change)="isSelectAllPlans($event.target.checked)"/>
        <label for="select-plan-checkbox">Select All Plans</label>
       </div>
	  
      <gpr-expand-collapse-icon (expand)="togglePlansVisibility($event)"></gpr-expand-collapse-icon>
      <div class="pull-right">
  <button class="btn btn-secondary">Cancel</button>
  <button class="btn btn-secondary" [disabled]="!canUpdateButtonDisabled"  (click)="getSelectedPlanNames()">Update Plans {{checkedPlansCount}}</button>
</div>`
  })
  class TestMassUpdateSelectPlanComponent {

    public selectAllPlans: boolean = false;
    
    public isExpanded: boolean = false;
 
    public productAnimateLabel: string ="Ravi";
    
	
	public sectionVisibilityState: AnimationState = AnimationState.VISIBLE;
   
    public togglePlansVisibility(e, i) {
	}
	
	public isSelectAllPlans(e) {
		
	}
 
 public getSelectedPlanNames(){

 } 
  }
  class MockActiveModal {
    dismiss() {
    }

    close(any) {
    }
  }
});
