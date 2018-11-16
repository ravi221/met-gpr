import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {ExpandCollapseIconComponent} from './expand-collapse-icon.component';
import {Component, DebugElement, ViewChild} from '@angular/core';
import {By} from '@angular/platform-browser';
import {click} from '../../../../assets/test/TestHelper';

describe('ExpandCollapseIconComponent', () => {
  let component: TestExpandCollapseIconComponent;
  let fixture: ComponentFixture<TestExpandCollapseIconComponent>;
  let span: DebugElement;
  let icon: DebugElement;

  function updateFixture() {
    fixture.detectChanges();
    span = fixture.debugElement.query(By.css('.expand-collapse-icon'));
    icon = fixture.debugElement.query(By.css('.material-icons'));
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ExpandCollapseIconComponent, TestExpandCollapseIconComponent]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(TestExpandCollapseIconComponent);
        component = fixture.componentInstance;
        updateFixture();
      });
  }));

  afterEach(() => {
    if (fixture) {
      fixture.destroy();
    }
  });

  it ('should by default set expand to false', () => {
    expect(component.expandCollapseIcon.isExpanded).toBeFalsy();
    expect(icon.nativeElement.innerText).toContain('keyboard_arrow_down');
  });

  it ('should display expand icon when clicked', () => {
    const spy = spyOn(component, 'onExpand').and.stub();
    click(span, fixture);
    updateFixture();
    expect(component.expandCollapseIcon.isExpanded).toBeTruthy();
    expect(icon.nativeElement.innerText).toContain('keyboard_arrow_up');
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith(true);
  });


  @Component({
    template: `
      <gpr-expand-collapse-icon (expand)="onExpand($event)"></gpr-expand-collapse-icon>`
  })
  class TestExpandCollapseIconComponent {
    @ViewChild(ExpandCollapseIconComponent) expandCollapseIcon;

    onExpand(e) {

    }
  }


});
