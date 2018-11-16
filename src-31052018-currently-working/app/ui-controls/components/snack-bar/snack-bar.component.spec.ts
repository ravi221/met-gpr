import {async, ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import {SnackBarComponent} from './snack-bar.component';
import {Component, ViewChild} from '@angular/core';

describe('SnackBarComponent', () => {
  let component: TestSnackBarComponent;
  let fixture: ComponentFixture<TestSnackBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SnackBarComponent, TestSnackBarComponent]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(TestSnackBarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
      });
  }));

  afterEach(() => {
    if (fixture) {
      fixture.destroy();
    }
  });

  it('should by default not show the snack bar', () => {
    expect(component.snackBar.show).toBeFalsy();
  });

  it('should call ngOnChanges when the show property is updated', () => {
    const spy = spyOn(component.snackBar, 'ngOnChanges').and.callThrough();
    component.show = true;
    fixture.detectChanges();
    expect(spy).toHaveBeenCalled();
  });

  it('should autohide the snack bar after 5000 ms', fakeAsync(() => {
    component.show = true;
    component.autoHide = true;
    fixture.detectChanges();
    expect(component.snackBar.show).toBeTruthy();

    tick(5001);
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      expect(component.snackBar.show).toBeFalsy();
    });
  }));

  it('should not hide the snack bar after 5000 ms when auto hide is false', fakeAsync(() => {
    component.show = true;
    component.autoHide = false;
    fixture.detectChanges();
    expect(component.snackBar.show).toBeTruthy();

    tick(5001);
    fixture.whenStable().then(() => {
      expect(component.snackBar.show).toBeTruthy();
    });
  }));

  @Component({
    template: '<gpr-snack-bar [show]="show" [autoHide]="autoHide"></gpr-snack-bar>'
  })
  class TestSnackBarComponent {
    @ViewChild(SnackBarComponent) snackBar;
    public show: boolean = false;
    public autoHide: boolean = false;
  }
});
