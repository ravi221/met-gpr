import {AnimationState} from '../../animations/AnimationState';
import {async, ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {LoadingSpinnerComponent} from './loading-spinner.component';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {Component} from '@angular/core';

describe('LoadingSpinnerComponent', () => {
  let component: TestLoadingSpinnerComponent;
  let fixture: ComponentFixture<TestLoadingSpinnerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule],
      declarations: [LoadingSpinnerComponent, TestLoadingSpinnerComponent]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(TestLoadingSpinnerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
      });
  }));

  afterEach(() => {
    if (fixture) {
      fixture.destroy();
    }
  });

  it('should show the loading icon when state is changed to visible', fakeAsync(() => {
    let loadingSpinner = fixture.debugElement.query(By.css('.loading-spinner-container'));
    expect(loadingSpinner.nativeElement.style.opacity).toBe('0');

    component.state = AnimationState.VISIBLE;
    fixture.detectChanges();
    tick(500);

    loadingSpinner = fixture.debugElement.query(By.css('.loading-spinner-container'));
    expect(loadingSpinner.nativeElement.style.opacity).toBe('1');
  }));

  it('should hide the loading icon when state is changed to hidden', fakeAsync(() => {
    component.state = AnimationState.VISIBLE;
    fixture.detectChanges();
    tick(500);

    let loadingSpinner = fixture.debugElement.query(By.css('.loading-spinner-container'));
    expect(loadingSpinner.nativeElement.style.opacity).toBe('1');

    component.state = AnimationState.HIDDEN;
    fixture.detectChanges();
    tick(500);

    loadingSpinner = fixture.debugElement.query(By.css('.loading-spinner-container'));
    expect(loadingSpinner.nativeElement.style.opacity).toBe('0');
  }));

  @Component({
    template: `
      <gpr-loading-spinner [state]="state"></gpr-loading-spinner>
    `
  })
  class TestLoadingSpinnerComponent {
    public state: AnimationState = AnimationState.HIDDEN;
  }

});
