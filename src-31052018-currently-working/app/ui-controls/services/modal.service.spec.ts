import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ModalService} from './modal.service';
import {Component, TemplateRef, Type, ViewChild} from '@angular/core';
import {IModalConfig} from '../interfaces/iModalConfig';
import {ModalContentType} from '../models/modal-content-type';
import {ActiveModalRef, ModalRef} from '../classes/modal-references';
import {BrowserDynamicTestingModule} from '@angular/platform-browser-dynamic/testing';
import {ModalContainerComponent} from '../components/modal/modal-container/modal-container.component';
import {ModalBackdropComponent} from '../components/modal/modal-backdrop/modal-backdrop.component';
import {IconComponent} from '../components/icon/icon.component';

describe('ModalService', () => {
  let modalConfig: IModalConfig;
  let modalContent: ModalContentType;
  let modalRef: ModalRef;
  let modalService: ModalService;
  let mockFixture: ComponentFixture<MockComponentContentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        ModalContainerComponent,
        ModalBackdropComponent,
        MockComponentContentComponent,
        IconComponent
      ],
      providers: [ModalService, ActiveModalRef]
    });

    // some sort of hack to include entry components into tests...
    // https://github.com/angular/angular/issues/10760
    TestBed.overrideModule(BrowserDynamicTestingModule, {
      set: {
        entryComponents: [ModalContainerComponent, ModalBackdropComponent, MockComponentContentComponent]
      }
    });

    mockFixture = TestBed.createComponent(MockComponentContentComponent);
    modalService = TestBed.get(ModalService);
  });

  afterEach(() => {
    if (modalRef) {
      modalRef.dismiss();
      modalRef = null;
    }
    modalConfig = {};
    modalContent = null;
  });

  describe('Modal Creation', () => {
    it('should create a modal with string as content', () => {
      modalContent = 'Test Modal Content';
      modalRef = modalService.open(modalContent);

      const modal: Element = document.body.querySelector('.modal-content');
      expect(modal.textContent.trim()).toEqual('Test Modal Content');
    });

    it('should create a modal with a component class as content', () => {
      modalRef = modalService.open(MockComponentContentComponent as Type<Component>);
      expect(modalRef.componentInstance).toBeTruthy();

      const modal: Element = document.body.querySelector('.modal-content');
      expect(modal.textContent.trim()).toEqual('This is a mock component class');
    });

    it('should create a modal with a template ref as content', () => {
      const templateRef = mockFixture.componentInstance.mockTemplate;
      modalRef = modalService.open(templateRef);
      const modal: Element = document.body.querySelector('.modal-content');
      expect(modal.textContent.trim()).toEqual('This is mock template');
    });
  });

  @Component({
    template: `
    <h1>This is a mock component class</h1>
    <ng-template #mockTemplate>This is mock template</ng-template>
  `
  })
  class MockComponentContentComponent {
    @ViewChild('mockTemplate', {read: TemplateRef}) mockTemplate: TemplateRef<any>;

    constructor(private _activeModal: ActiveModalRef) {
    }
  }
});

