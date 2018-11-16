import {ComponentFixture, fakeAsync, TestBed} from '@angular/core/testing';
import {ActiveModalRef} from '../../../classes/modal-references';
import {ConfirmDialogComponent} from './confirm-dialog.component';
import {By} from '@angular/platform-browser';
import {LoadingSpinnerService} from '../../../services/loading-spinner.service';
import {Observable} from 'rxjs/Observable';

describe('ConfirmDialogComponent', () => {
  let component: ConfirmDialogComponent;
  let fixture: ComponentFixture<ConfirmDialogComponent>;
  let activeModalRef: ActiveModalRef;
  let spinnerService: LoadingSpinnerService;

  beforeEach(() => {
    fixture = TestBed.configureTestingModule({
      declarations: [ConfirmDialogComponent],
      providers: [ActiveModalRef, LoadingSpinnerService]
    }).createComponent(ConfirmDialogComponent);
    component = fixture.componentInstance;
    activeModalRef = TestBed.get(ActiveModalRef);
    spinnerService = TestBed.get(LoadingSpinnerService);
  });

  afterEach( () => {
    if (fixture) {
      fixture.destroy();
    }
  });

  describe('Basic Rendering', () => {
    it('should display the correct message', () => {
      component.message = 'Test Message';
      fixture.detectChanges();
      const messageElement = fixture.debugElement.query(By.css('.modal-body')).children[0];
      expect(messageElement).toBeDefined();
      expect(messageElement.nativeElement.textContent.trim()).toBe('Test Message');
    });

    it('should display the correct text for the actions', () => {
      component.confirmText = 'Yes';
      component.cancelText = 'No';
      fixture.detectChanges();
      const footerElement = fixture.debugElement.query(By.css('.modal-footer'));
      expect(footerElement).toBeDefined();

      const confirmElement = footerElement.children[0].nativeElement;
      expect(confirmElement).toBeDefined();
      expect(confirmElement.textContent.trim()).toBe('Yes');

      const cancelElement = footerElement.children[1].nativeElement;
      expect(cancelElement).toBeDefined();
      expect(cancelElement.textContent.trim()).toBe('No');
    });
  });

  describe('Event Handling', () => {
    it('should close the modal', () => {
      const spy = spyOn(activeModalRef, 'close');
      const closeLink = fixture.debugElement.query(By.css('.modal-footer')).children[1];
      closeLink.nativeElement.click();
      expect(spy).toHaveBeenCalled();
    });

    it('should run the input synchronously', () => {
      component.action = syncFunction;
      component.args = [1, 2];
      const closeSpy = spyOn(activeModalRef, 'close');
      const functionSpy = spyOn(component.action, 'apply').and.callThrough();
      const spinnerShowSpy = spyOn(spinnerService, 'show');
      const spinnerHideSpy = spyOn(spinnerService, 'hide');
      const closeLink = fixture.debugElement.query(By.css('.modal-footer')).children[0];
      closeLink.nativeElement.click();
      expect(closeSpy).toHaveBeenCalled();
      expect(functionSpy).toHaveBeenCalled();
      expect(spinnerShowSpy).not.toHaveBeenCalled();
      expect(spinnerHideSpy).not.toHaveBeenCalled();
    });

    it('should run the input asynchronously', fakeAsync(() => {
      component.action = asyncFunction;
      component.args = [1, 2];
      component.isAsync = true;
      fixture.detectChanges();
      const closeSpy = spyOn(activeModalRef, 'close');
      const functionSpy = spyOn(component.action, 'apply').and.callThrough();
      const spinnerShowSpy = spyOn(spinnerService, 'show');
      const spinnerHideSpy = spyOn(spinnerService, 'hide');
      const closeLink = fixture.debugElement.query(By.css('.modal-footer')).children[0];
      closeLink.nativeElement.click();
      expect(closeSpy).toHaveBeenCalled();
      expect(functionSpy).toHaveBeenCalled();
      expect(spinnerShowSpy).toHaveBeenCalled();
      expect(spinnerHideSpy).toHaveBeenCalled();
    }));

    function syncFunction(a, b)  {
      return a > b;
    }

    function asyncFunction(a, b): Observable<any> {
      const sum = a + b;
      return Observable.of(sum);
    }
  });
});
