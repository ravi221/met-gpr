import {ContentRef, ModalRef} from './modal-references';
import {ComponentRef} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {ModalContainerComponent} from '../components/modal/modal-container/modal-container.component';
import {ModalBackdropComponent} from '../components/modal/modal-backdrop/modal-backdrop.component';
import {ModalDismissReasons} from '../enums/modal-dismiss-reasons';
import {Subscription} from 'rxjs/Subscription';
import {IconComponent} from '../components/icon/icon.component';

describe('ModalRef', () => {
  let modalRef: ModalRef;
  let containerFixture: ComponentFixture<ModalContainerComponent>;
  let backdropFixture: ComponentFixture<ModalBackdropComponent>;
  let containerRef: ComponentRef<ModalContainerComponent>;
  let backdropRef: ComponentRef<ModalBackdropComponent>;
  let contentRef: ContentRef;
  let subscription: Subscription;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ModalContainerComponent, ModalBackdropComponent, IconComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    containerFixture = TestBed.createComponent(ModalContainerComponent);
    backdropFixture = TestBed.createComponent(ModalBackdropComponent);

    containerRef = containerFixture.componentRef;
    backdropRef = backdropFixture.componentRef;
    contentRef = new ContentRef([]);
    modalRef = new ModalRef(containerRef, backdropRef, contentRef);
  });

  afterEach(() => {
    if (subscription) {
      subscription.unsubscribe();
    }
  });

  it('should call the dismiss function when container component emits dismiss event', () => {
    spyOn(modalRef, 'dismiss');
    containerRef.instance.onDismiss.emit(ModalDismissReasons.ESC_KEY_PRESSED);
    expect(modalRef.dismiss).toHaveBeenCalled();
  });

  it('should emit onClose event when close function is triggered', (done) => {
    subscription = modalRef.onClose
      .subscribe((result) => {
        expect(result).toEqual('Close function triggered!');
        done();
      });

    modalRef.close('Close function triggered!');
  });

  it('should emit onDismiss event when dismiss function is triggered', (done) => {
    subscription = modalRef.onDismiss
      .subscribe((reason) => {
        expect(reason).toEqual('Dismiss function triggered!');
        done();
      });

    modalRef.dismiss('Dismiss function triggered!');
  });
});
