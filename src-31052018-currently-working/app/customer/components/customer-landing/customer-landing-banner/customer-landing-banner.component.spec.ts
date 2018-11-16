import {AnimationState} from '../../../../ui-controls/animations/AnimationState';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {click} from '../../../../../assets/test/TestHelper';
import {CustomerLandingBannerComponent} from './customer-landing-banner.component';
import {DebugElement} from '@angular/core';
import {ExpandCollapseIconComponent} from '../../../../ui-controls/components/expand-collapse-icon/expand-collapse-icon.component';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';

describe('CustomerLandingBannerComponent', () => {
  let component: CustomerLandingBannerComponent;
  let fixture: ComponentFixture<CustomerLandingBannerComponent>;
  let collapseBtn: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule],
      declarations: [CustomerLandingBannerComponent, ExpandCollapseIconComponent]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(CustomerLandingBannerComponent);
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

  it('should toggle between showing and hiding customer detail', () => {
    expect(component.customerDetailsState).toBe(AnimationState.VISIBLE);
    click(collapseBtn, fixture);
    expect(component.customerDetailsState).toBe(AnimationState.HIDDEN);
    click(collapseBtn, fixture);
    expect(component.customerDetailsState).toBe(AnimationState.VISIBLE);
  });
});
