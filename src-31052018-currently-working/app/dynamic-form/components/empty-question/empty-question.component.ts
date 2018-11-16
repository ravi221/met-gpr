import {Component, EventEmitter, Input, Output} from '@angular/core';
import {IPlan} from '../../../plan/plan-shared/interfaces/iPlan';
import {IFormItemConfig} from '../../config/iFormItemConfig';
import DataManager from '../../classes/data-manager';
import {DynamicFormBaseComponent} from '../dynamic-form-base/dynamic-form-base.component';
import { IFlag } from 'app/flag/interfaces/iFlag';

/**
 * An empty question. Displayed when the component factory cannot find the inputed type
 */
@Component({
  selector: `gpr-blank`,
  template: `<div>{{config.label}}</div>`
})
export class EmptyQuestionComponent extends DynamicFormBaseComponent {
}

