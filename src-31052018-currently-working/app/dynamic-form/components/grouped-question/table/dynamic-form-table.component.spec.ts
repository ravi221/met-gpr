import {TableComponent} from './dynamic-form-table.component';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ModalService} from '../../../../ui-controls/services/modal.service';
import {DebugElement, NgModule, Type} from '@angular/core';
import {ModalContainerComponent} from '../../../../ui-controls/components/modal/modal-container/modal-container.component';
import {IconComponent} from '../../../../ui-controls/components/icon/icon.component';
import {CommonModule} from '@angular/common';
import {ModalBackdropComponent} from '../../../../ui-controls/components/modal/modal-backdrop/modal-backdrop.component';
import * as data from '../../../../../assets/test/dynamic-form/table-mock.json';
import {onChildUpdate} from '../../../../../assets/test/dynamic-form/onChildUpdate.mock';
import {GroupedQuestionConfig} from '../../../config/grouped-question-config';
import {By} from '@angular/platform-browser';
import {click} from '../../../../../assets/test/TestHelper';
import {DynamicFormTableService} from '../../../services/dynamic-form-table.service';
import {TableModalStubComponent} from './table-modal.component.stub';
import {DynamicFormControlComponent} from '../../../../forms-controls/components/dynamic-form-control/dynamic-form-control.component';
import {FormControlClassProviderService} from '../../../../forms-controls/services/form-control-class-provider.service';

describe( 'TableComponent', () => {
  let fixture: ComponentFixture<TableComponent>;
  let component: TableComponent;
  let debugElement: DebugElement;
  let modalService: ModalService;

  beforeEach( () => {
    fixture = TestBed.configureTestingModule({
      imports: [TestModule],
      declarations: [TableComponent],
      providers: [ModalService]
    }).createComponent(TableComponent);
    component = fixture.componentInstance;
    component.index = 1;
    component.config = new GroupedQuestionConfig(data, onChildUpdate);
    debugElement = fixture.debugElement;
    fixture.detectChanges();
  });

  afterEach( () => {
    if (fixture) {
      fixture.destroy();
    }
  });


  it('should have the proper labels', () => {
    const numberHtml = debugElement.query(By.css('.control-number'));
    expect(numberHtml.nativeElement.innerHTML).toBe(`${component.index}.`);
    const labelHtml = debugElement.query(By.css('.control-label'));
    expect(labelHtml.nativeElement.innerHTML).toBe(`${component.config.label}&nbsp;`);
  });

  it('should call handle open table when clicked', () => {
    modalService = TestBed.get(ModalService);
    const spy = spyOn(component, 'handleTableOpen').and.stub();
    const button = debugElement.query(By.css('.open-table-btn'));
    click(button, fixture);
    expect(spy).toHaveBeenCalled();
  });

  @NgModule({
    imports: [CommonModule],
    declarations: [ModalContainerComponent, IconComponent, ModalBackdropComponent, TableModalStubComponent, DynamicFormControlComponent, IconComponent],
    entryComponents: [ModalContainerComponent, ModalBackdropComponent, TableModalStubComponent, DynamicFormControlComponent],
    providers: [FormControlClassProviderService, DynamicFormTableService]
  })
  class TestModule {}
});
