import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {click} from '../../../../../assets/test/TestHelper';
import {Component, DebugElement} from '@angular/core';
import {CustomerLandingButtonsComponent} from './customer-landing-buttons.component';

describe('CustomerLandingButtonsComponent', () => {
  let component: TestCustomerLandingButtonsComponent;
  let fixture: ComponentFixture<TestCustomerLandingButtonsComponent>;
  let addPlanButton: DebugElement;
  let customerInfoButton: DebugElement;
  let massUpdateButton: DebugElement;
  let publishPlansButton: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CustomerLandingButtonsComponent, TestCustomerLandingButtonsComponent]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(TestCustomerLandingButtonsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        const buttons = fixture.debugElement.query(By.css('.customer-landing-buttons'));
        addPlanButton = buttons.children[0];
        customerInfoButton = buttons.children[1];
        massUpdateButton = buttons.children[2];
        publishPlansButton = buttons.children[3];
      });
  }));

  afterEach(() => {
    if (fixture) {
      fixture.destroy();
    }
  });

  describe('Event emitters', () => {
    it('should call function to emit add plan event', () => {
      const spy = spyOn(component, 'onAddPlan').and.stub();
      click(addPlanButton);
      expect(spy).toHaveBeenCalled();
    });

    it('should call function to emit customer info event', () => {
      const spy = spyOn(component, 'onCustomerInfo').and.stub();
      click(customerInfoButton);
      expect(spy).toHaveBeenCalled();
    });

    it('should call function to emit mass update event', () => {
      const spy = spyOn(component, 'onMassUpdate').and.stub();
      click(massUpdateButton);
      expect(spy).toHaveBeenCalled();
    });

    it('should call function to publish plans event', () => {
      const spy = spyOn(component, 'onPublish').and.stub();
      click(publishPlansButton);
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('Disabling add plan button', () => {
    it('should disable the add plan button', () => {
      component.isAddPlanDisabled = true;
      fixture.detectChanges();
      expect(addPlanButton.nativeElement.disabled).toBeTruthy();
    });

    it('should enable the add plan button', () => {
      component.isAddPlanDisabled = false;
      fixture.detectChanges();
      expect(addPlanButton.nativeElement.disabled).toBeFalsy();
    });
  });

  describe('Disabling add mass update button', () => {
    it('should disable the mass update button', () => {
      component.isMassUpdateDisabled = true;
      fixture.detectChanges();
      expect(massUpdateButton.nativeElement.disabled).toBeTruthy();
    });

    it('should enable the mass update button', () => {
      component.isMassUpdateDisabled = false;
      fixture.detectChanges();
      expect(massUpdateButton.nativeElement.disabled).toBeFalsy();
    });
  });

  describe('Disabling publish button', () => {
    it('should disable the add plan button', () => {
      component.isPublishDisabled = true;
      fixture.detectChanges();
      expect(publishPlansButton.nativeElement.disabled).toBeTruthy();
    });

    it('should enable the publish button', () => {
      component.isPublishDisabled = false;
      fixture.detectChanges();
      expect(publishPlansButton.nativeElement.disabled).toBeFalsy();
    });
  });

  @Component({
    template: `
      <gpr-customer-landing-buttons [isAddPlanDisabled]="isAddPlanDisabled"
                                    [isMassUpdateDisabled]="isMassUpdateDisabled"
                                    [isPublishDisabled]="isPublishDisabled"
                                    (addPlanClick)="onAddPlan()"
                                    (customerInfoClick)="onCustomerInfo()"
                                    (massUpdateClick)="onMassUpdate()"
                                    (publishPlansClick)="onPublish()"></gpr-customer-landing-buttons>
    `
  })
  class TestCustomerLandingButtonsComponent {
    isAddPlanDisabled = false;
    isMassUpdateDisabled = false;
    isPublishDisabled = false;

    onAddPlan() {
    }

    onCustomerInfo() {
    }

    onMassUpdate() {
    }

    onPublish() {
    }
  }
});
