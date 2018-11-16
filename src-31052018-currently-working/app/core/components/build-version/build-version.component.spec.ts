import {Component, DebugElement, ViewChild} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {BuildVersionService} from '../../services/build-version.service';
import {BuildVersionComponent} from './build-version.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {Observable} from 'rxjs/Observable';
import {By} from '@angular/platform-browser';

describe('BuildVersionComponent', () => {
  let component: TestBuildVersionComponent;
  let fixture: ComponentFixture<TestBuildVersionComponent>;
  let buildLabel: DebugElement;
  let buildVersion: DebugElement;
  let spy: jasmine.Spy;

  const updateFixture = () => {
    fixture.detectChanges();
    buildLabel = fixture.debugElement.query(By.css('.build-label'));
    buildVersion = fixture.debugElement.query(By.css('.build-value'));
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [TestBuildVersionComponent, BuildVersionComponent],
      providers: [BuildVersionService]
    })
      .compileComponents()
      .then(() => {
        spy = spyOn(TestBed.get(BuildVersionService), 'getBuildVersion').and.returnValue(Observable.of('1.0.0'));
        fixture = TestBed.createComponent(TestBuildVersionComponent);
        component = fixture.componentInstance;
        updateFixture();
      });
  }));

  afterEach(() => {
    if (fixture) {
      fixture.destroy();
    }
  });

  describe('Rendering build version', () => {
    it('should display \'1.0.0\' for the build version', () => {
      expect(buildLabel.nativeElement.innerText).toContain('build');
      expect(buildVersion.nativeElement.innerText).toBe('1.0.0');
      expect(component.buildVersion.showBuildVersion).toBeTruthy();
    });

    it('should not display the build version when version is null', () => {
      spy.and.returnValue(Observable.of(null));
      component.buildVersion.ngOnInit();
      updateFixture();

      expect(buildLabel).toBeNull();
      expect(buildVersion).toBeNull();
      expect(component.buildVersion.showBuildVersion).toBeFalsy();
    });

    it('should not display the build version when version is undefined', () => {
      spy.and.returnValue(Observable.of(undefined));
      component.buildVersion.ngOnInit();
      updateFixture();

      expect(buildLabel).toBeNull();
      expect(buildVersion).toBeNull();
      expect(component.buildVersion.showBuildVersion).toBeFalsy();
    });

    it('should not display the build version when version is empty', () => {
      spy.and.returnValue(Observable.of(''));
      component.buildVersion.ngOnInit();
      updateFixture();

      expect(buildLabel).toBeNull();
      expect(buildVersion).toBeNull();
      expect(component.buildVersion.showBuildVersion).toBeFalsy();
    });
  });

  @Component({
    template: `
      <gpr-build-version></gpr-build-version>`
  })
  class TestBuildVersionComponent {
    @ViewChild(BuildVersionComponent) buildVersion;
  }
});
