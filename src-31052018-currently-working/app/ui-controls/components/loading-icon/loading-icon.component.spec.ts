import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {LoadingIconComponent} from './loading-icon.component';
import {Component, DebugElement} from '@angular/core';
import {By} from '@angular/platform-browser';

describe('LoadingIconComponent', () => {
  let component: TestLoadingIconComponent;
  let fixture: ComponentFixture<TestLoadingIconComponent>;
  let loadingIcon: DebugElement;

  const updateFixture = () => {
    fixture.detectChanges();
    loadingIcon = fixture.debugElement.query(By.css('.loading-bar'));
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TestLoadingIconComponent, LoadingIconComponent]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(TestLoadingIconComponent);
        component = fixture.componentInstance;
        updateFixture();
      });
  }));

  afterEach(() => {
    if (fixture) {
      fixture.destroy();
    }
  });

  it('should toggle visibility when updating show indicator', () => {
    component.show = true;
    updateFixture();
    expect(loadingIcon.properties.hidden).toBeFalsy();

    component.show = false;
    updateFixture();
    expect(loadingIcon.properties.hidden).toBeTruthy();

    component.show = true;
    updateFixture();
    expect(loadingIcon.properties.hidden).toBeFalsy();
  });

  @Component({
    template: `
      <gpr-loading-icon [show]="show"></gpr-loading-icon>`
  })
  class TestLoadingIconComponent {
    public show: boolean = true;
  }
});
