import {CommonModule} from '@angular/common';
import {DynamicFormComponent} from './components/dynamic-form/dynamic-form.component';
import {DynamicFormItemComponent} from './components/dynamic-form-item/dynamic-form-item.component';
import {DynamicQuestionComponent} from './components/dynamic-question/dynamic-question.component';
import {DynamicSectionsListComponent} from './components/dynamic-sections-list/dynamic-sections-list.component';
import {DynamicSectionsListItemComponent} from './components/dynamic-sections-list-item/dynamic-sections-list-item';
import {EmptyQuestionComponent} from './components/empty-question/empty-question.component';
import {GroupedQuestionComponent} from './components/grouped-question/grouped-question.component';
import {NgModule} from '@angular/core';
import {NotHiddenPipe} from './pipes/not-hidden.pipe';
import {ReactiveFormsModule} from '@angular/forms';
import {UIControlsModule} from '../ui-controls/ui-controls.module';
import {GroupedOtherComponent} from './components/grouped-question/grouped-other/grouped-other.component';
import {TableComponent} from './components/grouped-question/table/dynamic-form-table.component';
import {TableModalComponent} from './components/grouped-question/table/table-modal.component';
import {DynamicFormTableService} from './services/dynamic-form-table.service';
import {FormControlsModule} from '../forms-controls/form-controls.module';
import {MassUpdateQuestionComponent} from './components/mass-update-question/mass-update-question.component';
import {MassUpdateSelectPlanComponent} from './components/mass-update-select-plan/mass-update-select-plan.component';
import {FormsModule} from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    UIControlsModule,
    FormControlsModule,
    FormsModule
  ],
  declarations: [
    DynamicFormComponent,
    GroupedOtherComponent,
    DynamicFormItemComponent,
    DynamicQuestionComponent,
    DynamicSectionsListComponent,
    DynamicSectionsListItemComponent,
    EmptyQuestionComponent,
    GroupedQuestionComponent,
    NotHiddenPipe,
    TableComponent,
    TableModalComponent,
    MassUpdateQuestionComponent,
    MassUpdateSelectPlanComponent
  ],
  exports: [
    DynamicFormComponent,
    DynamicSectionsListComponent,
    MassUpdateQuestionComponent
  ],
  providers: [
    NotHiddenPipe,
    DynamicFormTableService
  ],
  entryComponents: [
    DynamicQuestionComponent,
    EmptyQuestionComponent,
    GroupedQuestionComponent,
    DynamicQuestionComponent,
    MassUpdateQuestionComponent,
    MassUpdateSelectPlanComponent,
    GroupedOtherComponent,
    GroupedQuestionComponent,
    EmptyQuestionComponent,
    TableComponent,
    TableModalComponent
  ]
})
export class DynamicFormModule {
}
