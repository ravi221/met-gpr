import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ModalContainerComponent} from './modal-container.component';
import {DebugElement} from '@angular/core';
import {By} from '@angular/platform-browser';
import {ModalDismissReasons} from '../../../enums/modal-dismiss-reasons';
import {IconComponent} from '../../icon/icon.component';

describe('ModalContainerComponent', () => {
  let component: ModalContainerComponent;
  let fixture: ComponentFixture<ModalContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ModalContainerComponent, IconComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Basic Rendering', () => {
    it('should apply the appropriate class to body element', () => {
      fixture.whenRenderingDone().then(() => {
        const body: Element = document.body;
        expect(body.classList.contains('modal-open')).toEqual(true);
      });
    });

    it('should remove the appropriate class from body element when destroyed', () => {
      fixture.destroy();
      const body: Element = document.body;
      expect(body.classList.contains('modal-open')).toEqual(false);
    });

    it('should render the modal container and dialog', () => {
      const containerElement: DebugElement = fixture.debugElement.children[0];
      const dialogElement: DebugElement = fixture.debugElement.query(By.css('.modal-dialog'));

      expect(containerElement).toBeDefined();
      expect(containerElement.nativeElement.classList.contains('modal')).toEqual(true);
      expect(dialogElement).toBeDefined();
    });

    it('should render the modal dialog with a specified size class', () => {
      component.size = 'sm';
      fixture.detectChanges();

      const dialogElement: DebugElement = fixture.debugElement.query(By.css('.modal-dialog'));

      expect(dialogElement).toBeDefined();
      expect(dialogElement.nativeElement.classList.contains('modal-sm')).toEqual(true);
    });

    it('should render the modal container with a custom class', () => {
      component.containerClass = 'custom-test-class';
      fixture.detectChanges();

      const containerElement: DebugElement = fixture.debugElement.children[0];

      expect(containerElement).toBeDefined();
      expect(containerElement.nativeElement.classList.contains('custom-test-class')).toEqual(true);
    });
  });

  describe('Dismissal Functionality', () => {
    it('should not dismiss on backdrop click by default', (done) => {
      component.onDismiss.subscribe(() => {
        done.fail(new Error('Should not have triggered the dismiss event'));
      });
      const containerElement: DebugElement = fixture.debugElement.children[0];
      containerElement.nativeElement.click();
      done();
    });

    it('should not dismiss when backdrop is false and close on backdrop is false', (done) => {
      component.backdrop = false;
      component.closeOnBackdropClick = false;
      fixture.detectChanges();

      component.onDismiss.subscribe(() => {
        done.fail(new Error('Should not have triggered the dismiss event'));
      });
      const containerElement: DebugElement = fixture.debugElement.children[0];
      containerElement.nativeElement.click();
      done();
    });

    it('should not dismiss when close on backdrop is false', (done) => {
      component.closeOnBackdropClick = false;
      fixture.detectChanges();

      component.onDismiss.subscribe(() => {
        done.fail(new Error('Should not have triggered the dismiss event'));
      });
      const containerElement: DebugElement = fixture.debugElement.children[0];
      containerElement.nativeElement.click();
      done();
    });

    it('should dismiss on backdrop click when backdrop value and close on backdrop click is true', (done) => {
      component.backdrop = true;
      component.closeOnBackdropClick = true;
      fixture.detectChanges();

      component.onDismiss.subscribe(($event) => {
        expect($event).toBe(ModalDismissReasons.BACKDROP_CLICKED);
        done();
      });
      const containerElement: DebugElement = fixture.debugElement.children[0];
      containerElement.nativeElement.click();
    });

    it('should not dismiss on modal dialog element click', (done) => {
      component.onDismiss.subscribe(() => {
        done.fail(new Error('Should not have triggered the dismiss event'));
      });
      const dialogElement: DebugElement = fixture.debugElement.query(By.css('.modal-dialog'));
      dialogElement.nativeElement.click();
      done();
    });

    it('should not dismiss on ESC keypress by default', (done) => {
      component.onDismiss.subscribe(() => {
        done.fail(new Error('Should not have triggered the dismiss event'));
      });
      fixture.debugElement.triggerEventHandler('keyup.esc', {});
      done();
    });

    it('should dismiss on ESC keypress when closeOnEsc is true', (done) => {
      component.closeOnEsc = true;
      fixture.detectChanges();
      component.onDismiss.subscribe(($event) => {
        expect($event).toBe(ModalDismissReasons.ESC_KEY_PRESSED);
        done();
      });
      fixture.debugElement.triggerEventHandler('keyup.esc', {});
    });
  });
});
