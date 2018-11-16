import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {ModalBackdropComponent} from './modal-backdrop.component';
import {DebugElement} from '@angular/core';

describe('ModalBackdropComponent', () => {
  let component: ModalBackdropComponent;
  let fixture: ComponentFixture<ModalBackdropComponent>;
  let backdropElement: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ModalBackdropComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalBackdropComponent);
    component = fixture.componentInstance;
    backdropElement = fixture.debugElement.children[0];
    fixture.detectChanges();
  });

  it('should render the backdrop element', () => {
    expect(backdropElement).toBeDefined();
  });

  it('should render with appropriate CSS classes', () => {
    expect(backdropElement.attributes.class.indexOf('modal-backdrop')).toBeGreaterThan(-1);
  });
});
