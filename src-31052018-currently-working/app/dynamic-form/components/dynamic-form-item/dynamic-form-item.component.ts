import {AfterContentInit, Component, ComponentFactoryResolver, ComponentRef, EventEmitter, Input, OnChanges, Output, Type, ViewChild, ViewContainerRef, OnInit} from '@angular/core';
import {IFormItemConfig} from '../../config/iFormItemConfig';
import {IPlan} from '../../../plan/plan-shared/interfaces/iPlan';
import DataManager from '../../classes/data-manager';
import {FormItemType} from '../../enumerations/form-items-type';
import {DynamicQuestionComponent} from '../dynamic-question/dynamic-question.component';
import {GroupedQuestionComponent} from '../grouped-question/grouped-question.component';
import {DynamicFormBaseComponent} from '../dynamic-form-base/dynamic-form-base.component';
import {EmptyQuestionComponent} from '../empty-question/empty-question.component';
import {FormGroupType} from '../../enumerations/form-group-type';
import {GroupedQuestionConfig} from '../../config/grouped-question-config';
import {TableComponent} from '../grouped-question/table/dynamic-form-table.component';
import {GroupedOtherComponent} from '../grouped-question/grouped-other/grouped-other.component';
import { IFlag } from 'app/flag/interfaces/iFlag';
import { IComment } from 'app/comment/interfaces/iComment';

/**
 * Displays the correct type of question based on the type of the inputed configuration
 */
@Component({
  selector: `gpr-dynamic-form-item`,
  template: `<div #target></div>`
})
export class DynamicFormItemComponent implements AfterContentInit, OnChanges {

  /**
   * The configuration item
   */
  @Input() config: IFormItemConfig;
  /**
   * An {@link DataManager} wrapping the model object to be edited through the form
   */
  @Input() model: DataManager;

  /**
   * The ordinal index of the item in the form
   */
  @Input() index: number;

  /**
   * Plan object, used for information to create flags and comments
   */
  @Input() plan: IPlan;

  /**
   * Customer id used for information to create flags and comments
   */
  @Input() customerNumber: number;

  /**
   * Contains flag if one exists for this question
   */
  @Input() questionFlag: IFlag;

  /**
   * contains comments if they already exist for this question
   */
  @Input() questionComments: IComment;

  /**
   * View of the child component. used to render component dynamically
   */
  @ViewChild('target', {read: ViewContainerRef}) target: ViewContainerRef;

  /**
   * Get a reference to the child component
   */
  private _componentReference: ComponentRef<DynamicFormBaseComponent>;

  /**
   * get a refernece to the component factory resolver. Used to make components at run time
   * @param {ComponentFactoryResolver} _compiler
   */
  constructor(private _compiler: ComponentFactoryResolver) {}

  /**
   * Generates the child component based on the config type
   */
  ngAfterContentInit() {
    let childComponent = this._getComponentType(this.config.getType());
    let componentFactory = this._compiler.resolveComponentFactory(childComponent);
    this._componentReference = this.target.createComponent(componentFactory);
    this._renderComponent();
  }

  /**
   * Update the child component when changes occurs
   */
  ngOnChanges() {
    this._renderComponent();
  }

  /**
   * Updates each of the input elements for the child component
   * @private
   */
  private _renderComponent(): void {
    if (this._componentReference) {
      this._componentReference.instance.config = this.config;
      this._componentReference.instance.model = this.model;
      this._componentReference.instance.index = this.index;
      this._componentReference.instance.plan = this.plan;
      this._componentReference.instance.customerNumber = this.customerNumber;
      this._componentReference.instance.questionFlag = this.questionFlag;
      this._componentReference.instance.questionComments = this.questionComments;
    }
  }

  /**
   * Gets the type of component. Used to compile components dynamically
   * @param {FormItemType} type
   * @returns {Type<DynamicFormBaseComponent>}
   * @private
   */
  private _getComponentType(type: FormItemType): Type<DynamicFormBaseComponent> {
    let componentType: Type<DynamicFormBaseComponent>;
    switch (type) {
      case FormItemType.SINGLE_QUESTION: {
        componentType = DynamicQuestionComponent;
        break;
      } case FormItemType.GROUPED_QUESTION: {
        if (this.config instanceof GroupedQuestionConfig) {
          const groupedConfig = this.config as GroupedQuestionConfig;
          componentType = this._getGroupType(groupedConfig.groupType);
          break;
        } else {
          componentType = EmptyQuestionComponent;
          break;
        }
      }  default: {
        componentType = EmptyQuestionComponent;
      }
    }
    return componentType;
  }

  /**
   * If the component would be a grouped component determine the type of group
   * @param {FormGroupType} groupType
   * @returns {Type<DynamicFormBaseComponent>}
   * @private
   */
  private _getGroupType(groupType: FormGroupType): Type<DynamicFormBaseComponent> {
    let groupComponentType: Type<DynamicFormBaseComponent>;
    let groupTypeName: FormGroupType = groupType;
    switch (groupTypeName) {
      case FormGroupType.VERTICAL_GROUP: {
        groupComponentType = GroupedQuestionComponent;
        break;
      } case FormGroupType.CHECK_BOX_OTHER :
        case FormGroupType.RADIO_BUTTON_OTHER:
        case FormGroupType.DROP_DOWN_OTHER:
        case FormGroupType.VERTICAL_GROUP_OTHER: {
          groupComponentType = GroupedOtherComponent;
          break;
        } case FormGroupType.TABLE: {
          groupComponentType = TableComponent;
          break;
        } default: {
        groupComponentType = EmptyQuestionComponent;
      }
    }
    return groupComponentType;
  }
}

