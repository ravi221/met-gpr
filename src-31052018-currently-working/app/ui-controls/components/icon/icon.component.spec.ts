import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {IconComponent} from './icon.component';
import {By} from '@angular/platform-browser';
import {Component, DebugElement} from '@angular/core';

describe('IconComponent', () => {
  let component: TestIconComponent;
  let fixture: ComponentFixture<TestIconComponent>;
  let img: DebugElement;

  const updateFixture = (name: string, state: string) => {
    component.name = name;
    component.state = state;
    fixture.detectChanges();
    img = fixture.debugElement.query(By.css('img'));
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [IconComponent, TestIconComponent]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(TestIconComponent);
        component = fixture.componentInstance;
        updateFixture('', '');
      });
  }));

  afterEach(() => {
    if (fixture) {
      fixture.destroy();
    }
  });

  describe('Invalid icons', () => {
    it('should not render an icon when the name is null', () => {
      updateFixture(null, null);
      expect(img).toBeNull();
    });

    it('should not render an icon when the name is undefined', () => {
      updateFixture(undefined, null);
      expect(img).toBeNull();
    });

    it('should not render an icon when the name is empty', () => {
      updateFixture('', null);
      expect(img).toBeNull();
    });
  });

  describe('Rendering without a state', () => {
    it('should render an icon when state is null', () => {
      updateFixture('clock', null);
      expect(img).toBeTruthy();
      expect(img.nativeElement.src).toContain('content/img/clock-icon.svg');
    });

    it('should render an icon when state is undefined', () => {
      updateFixture('clock', undefined);
      expect(img).toBeTruthy();
      expect(img.nativeElement.src).toContain('content/img/clock-icon.svg');
    });

    it('should render an icon when state is empty', () => {
      updateFixture('clock', '');
      expect(img).toBeTruthy();
      expect(img.nativeElement.src).toContain('content/img/clock-icon.svg');
    });
  });

  it('should render an icon with a name and state', () => {
    updateFixture('check', 'off');
    expect(img).toBeTruthy();
    expect(img.nativeElement.src).toContain('content/img/check-off-icon.svg');
  });

  @Component({
    template: '<gpr-icon [name]="name" [state]="state"></gpr-icon> '
  })
  class TestIconComponent {
    public name: string = '';
    public state: string = '';
  }
});
