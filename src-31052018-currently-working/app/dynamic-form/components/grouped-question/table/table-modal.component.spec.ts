import {Component, EventEmitter, NgModule, OnInit, ViewChild} from '@angular/core';
import * as config from '../../../../../assets/test/dynamic-form/table-formConfig.mock.json';
import * as data from '../../../../../assets/test/dynamic-form/table-model.mock.json';
import FormConfig from '../../../config/form-config';
import {GroupedQuestionConfig} from '../../../config/grouped-question-config';
import DataManager from '../../../classes/data-manager';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {TableModalComponent} from './table-modal.component';
import {IconComponent} from '../../../../ui-controls/components/icon/icon.component';
import {By} from '@angular/platform-browser';
import {DynamicFormTableService} from '../../../services/dynamic-form-table.service';
import {click} from '../../../../../assets/test/TestHelper';
import {DynamicFormControlStubComponent} from '../../../../forms-controls/components/dynamic-form-control/dynamic-form-control.component.stub';
import {DynamicFormControlComponent} from '../../../../forms-controls/components/dynamic-form-control/dynamic-form-control.component';
import {FormControlClassProviderService} from '../../../../forms-controls/services/form-control-class-provider.service';
import {TextInputComponent} from '../../../../forms-controls/components/text-input/text-input.component';
import {MinAttributeDirective} from '../../../../forms-controls/directives/min-attribute.directive';
import {INavState} from '../../../../navigation/interfaces/iNavState';
import {getNavStateForDataManager} from '../../../../../assets/test/NavStateHelper';

describe('TableModalComponent', () => {

  let fixture: ComponentFixture<TableModalTestComponent>;
  let component: TableModalComponent;
  let parentComponent: TableModalTestComponent;
  let childComponent: DynamicFormControlStubComponent;
  let navState: INavState = getNavStateForDataManager(data);

  beforeEach( async(() => {
    TestBed.configureTestingModule({
      imports: [TestModule],
      declarations: [TableModalComponent, TableModalTestComponent, IconComponent, DynamicFormControlComponent],
      providers: [FormControlClassProviderService, DynamicFormTableService]
    }).compileComponents().then( () => {
      fixture = TestBed.createComponent(TableModalTestComponent);
      parentComponent = fixture.componentInstance;
      fixture.detectChanges();
      component = parentComponent.tableModalComponent;
      childComponent = fixture.debugElement.query(By.directive(DynamicFormControlComponent)).componentInstance;
    });
  }));

  afterEach( () => {
    if (fixture) {
      fixture.destroy();
    }
  });

  it('should initialize properly', () => {
     expect(component.rows.length).toBe(2);
     expect(fixture.debugElement.queryAll(By.css('gpr-dynamic-form-control')).length).toBe(4);
  });

  it('should call removeRow when the icon is clicked', async(() => {
    const spy = spyOn(component, 'removeRow').and.callThrough();
    const removeButton = fixture.debugElement.query(By.directive(IconComponent));
    click(removeButton, fixture);
    fixture.whenStable().then( () => {
      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledWith(0);
      expect(fixture.debugElement.queryAll(By.css('gpr-dynamic-form-control')).length).toBe(2);
    });
  }));

  it('should call addRow when add another is clicked', () => {
    const spy = spyOn(component, 'addRow').and.callThrough();
    const addButton = fixture.debugElement.nativeElement.querySelector('.add-row');
    click(addButton, fixture);
    expect(spy).toHaveBeenCalled();
    expect(fixture.debugElement.queryAll(By.css('gpr-dynamic-form-control')).length).toBe(6);
  });

  it('should call onValueChanged when updating the model', () => {
    const spy = spyOn(component, 'onValueChanged');
    childComponent.valueChanged.emit({value: 1});
    fixture.detectChanges();
    expect(spy).toHaveBeenCalled();
  });

  @Component({
    selector: 'gpr-test-component',
    template: `<gpr-table-modal [config]="config" [model]="model" (answeredQuestion)="onAnswer()"></gpr-table-modal>`
  })
  class TableModalTestComponent implements OnInit {

    public formConfig: FormConfig;
    public config: GroupedQuestionConfig;
    public model: DataManager;
    public answeredQuestion: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild(TableModalComponent) tableModalComponent: TableModalComponent;
    ngOnInit() {
      this.formConfig = new FormConfig(config);
      this.formConfig.activateCategoryById(this.formConfig.categories[0].categoryId);
      this.model = this.formConfig.initializeModel(navState);
      this.config = this.formConfig.categories[0].sections[0].formItems[0] as GroupedQuestionConfig;
    }

    public onAnswer(): void {}
  }

  @NgModule({
    declarations: [TextInputComponent, MinAttributeDirective],
    entryComponents: [TextInputComponent],
    exports: [TextInputComponent]
  })
  class TestModule {}
});
