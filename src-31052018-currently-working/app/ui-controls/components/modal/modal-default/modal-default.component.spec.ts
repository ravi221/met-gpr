import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ModalDefaultComponent} from './modal-default.component';
import {ActiveModalRef} from '../../../classes/modal-references';
import {By} from '@angular/platform-browser';
import {HelpTooltipComponent} from '../../help-tooltip/help-tooltip.component';
import {TooltipDirective} from '../../tooltip/tooltip.directive';
import {TooltipContentComponent} from '../../tooltip/tooltip-content.component';
import {IconComponent} from '../../icon/icon.component';
import {HelpDataService} from '../../../../plan/services/help-data.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {TooltipPositionService} from '../../../services/tooltip-position.service';
import {TooltipService} from '../../../services/tooltip.service';

describe('ModalDefaultComponent', () => {
  let component: ModalDefaultComponent;
  let fixture: ComponentFixture<ModalDefaultComponent>;
  let activeModalRef: ActiveModalRef;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ModalDefaultComponent,
        HelpTooltipComponent,
        TooltipDirective,
        TooltipContentComponent,
        IconComponent],
      providers: [ActiveModalRef, HelpDataService, TooltipPositionService, TooltipService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalDefaultComponent);
    component = fixture.componentInstance;
    activeModalRef = TestBed.get(ActiveModalRef);
  });

  describe('Basic Rendering', () => {
    it('should render the specified message in the modal header', () => {
      component.title = 'This is the Header';
      fixture.detectChanges();
      const modalHeaderElement = fixture.debugElement.query(By.css('.modal-header')).children[0];
      expect(modalHeaderElement).toBeDefined();
      expect(modalHeaderElement.nativeElement.textContent.trim()).toBe('This is the Header');
    });
    it('should render the specified message in the modal body', () => {
      component.message = 'This is a test message';
      fixture.detectChanges();
      const modalBodyElement = fixture.debugElement.query(By.css('.modal-body'));
      expect(modalBodyElement.nativeElement.textContent.trim()).toBe('This is a test message');
    });
    it('should not render the modal header', () => {
      component.message = 'This is a test message';
      fixture.detectChanges();
      const modalHeaderElement = fixture.debugElement.query(By.css('.modal-header'));
      expect(modalHeaderElement == null).toBeTruthy();
    });

    it('should render both the modal header and modal body', () => {
      component.message = 'This is a test message';
      component.title = 'This is the Title';
      fixture.detectChanges();
      const modalHeaderElement = fixture.debugElement.query(By.css('.modal-header')).children[0];
      const modalBodyElement = fixture.debugElement.query(By.css('.modal-body'));
      expect(modalHeaderElement).toBeDefined();
      expect(modalBodyElement).toBeDefined();
      expect(modalHeaderElement.nativeElement.textContent.trim()).toBe('This is the Title');
      expect(modalBodyElement.nativeElement.textContent.trim()).toBe('This is a test message');
    });

    it('should render the specified dismiss text for the dismiss link', () => {
      component.dismissText = 'Dismiss Me';
      fixture.detectChanges();
      const dismissLink = fixture.debugElement.query(By.css('.modal-footer')).children[0];
      expect(dismissLink).toBeDefined();
      expect(dismissLink.nativeElement.textContent.trim()).toBe('Dismiss Me');
    });

    it('should render the specified close text for the close link', () => {
      component.closeText = 'Close Me';
      fixture.detectChanges();
      const closeLink = fixture.debugElement.query(By.css('.modal-footer')).children[1];
      expect(closeLink).toBeDefined();
      expect(closeLink.nativeElement.textContent.trim()).toBe('Close Me');
    });
    it('should not render help text when is not provided', () => {
      component.title = 'Title';
      fixture.detectChanges();
      const helpText = fixture.debugElement.query(By.css('.help-tooltip-content'));
      expect(helpText).toBeNull();
    });
    it('should not render help text when is empty', () => {
      component.title = 'Title';
      component.helpText = '';
      fixture.detectChanges();
      const helpText = fixture.debugElement.query(By.css('.help-tooltip-content'));
      expect(helpText).toBeNull();
    });
    it('should render help text when provided', () => {
      component.helpText = 'Help text!';
      component.title = 'Title';
      fixture.detectChanges();
      const helpText = fixture.debugElement.query(By.css('.help-tooltip-content')).nativeElement;
      expect(helpText.textContent.trim()).toContain('Help text!');
    });
  });

  describe('Event Handling', () => {
    it('should call the dismiss function of the modal reference', () => {
      spyOn(activeModalRef, 'dismiss');
      const dismissLink = fixture.debugElement.query(By.css('.modal-footer')).children[0];
      dismissLink.nativeElement.click();
      expect(activeModalRef.dismiss).toHaveBeenCalled();
    });

    it('should call the close function of the modal reference', () => {
      spyOn(activeModalRef, 'close');
      const closeLink = fixture.debugElement.query(By.css('.modal-footer')).children[1];
      closeLink.nativeElement.click();
      expect(activeModalRef.close).toHaveBeenCalled();
    });
  });


});
