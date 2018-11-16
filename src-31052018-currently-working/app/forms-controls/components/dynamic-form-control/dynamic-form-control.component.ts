import {
  Component,
  ComponentFactory,
  ComponentFactoryResolver,
  ComponentRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  Type,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {FormControl} from '../form-control';
import ChoiceConfig from '../../config/choice-config';
import {FormControlClassProviderService} from '../../services/form-control-class-provider.service';
import {StaticTextComponent} from '../static-text/static-text.component';
import QuestionConfig from '../../../dynamic-form/config/question-config';

/**
 * The core of the 'rendering engine' component of GPR.  Its primary function
 * is to examine the type and switch in the correct
 * component instance.
 */
@Component({
  selector: 'gpr-dynamic-form-control',
  template: `
    <ng-container #container></ng-container>`
})
export class DynamicFormControlComponent implements OnInit, OnDestroy, OnChanges {

  /**
   * A reference to the div element in which the correct
   * {@link FormControl} component will be inserted
   */
  @ViewChild('container', {read: ViewContainerRef}) container: ViewContainerRef;

  /**
   * The value to be passed through to the {@link FormControl} component
   */
  @Input() value: any;

  /**
   * The question id to be passed through to the {@link FormControl} component
   */
  @Input() id: string;

  /**
   * The configuration for a question
   */
  @Input() config: QuestionConfig;

  /**
   * The key to be used to determine the correct {@link FormControl} component - either
   * the class name of one of our form control components or an alias
   */
  @Input() type: string;

  /**
   * The {@link ChoiceConfig} array to be passed through to the {@link FormControl} component
   */
  @Input() choices: Array<ChoiceConfig>;

  /**
   * A boolean indicating whether the {@link FormControl} component should be disabled
   */
  @Input() isDisabled: boolean;

  /**
   * A boolean indicating whether the {@link FormControl} component should be hidden
   */
  @Input() isHidden: boolean;

  /**
   * A boolean indicating whether the {@link FormControl} component has a valid state
   */
  @Input() isValid: boolean;

  /**
   * A boolean indicating whether the {@link FormControl} component should be required
   */
  @Input() isRequired: boolean;

  /**
   * An EventEmitter with the same signature as the {@link FormControl}
   * valueChanged event.  This will be emitted whenever the corresponding
   * event on the form control is emitted.
   */
  @Output() valueChanged: EventEmitter<any> = new EventEmitter<any>();

  /**
   * Holds a reference to the created form control, used to create the component
   */
  private componentRef: ComponentRef<FormControl>;

  /**
   * Creates the dynamic form control
   * @param {ComponentFactoryResolver} _componentFactoryResolver
   * @param {FormControlClassProviderService} _formControlClassProvider
   */
  constructor(private _componentFactoryResolver: ComponentFactoryResolver,
              private _formControlClassProvider: FormControlClassProviderService) {
  }

  /**
   * On init, create the new form control based on the type input
   */
  ngOnInit(): void {
    if (this.type) {
      let componentType: Type<FormControl> = this._getComponentType(this.type);
      let factory: ComponentFactory<FormControl> = this._componentFactoryResolver.resolveComponentFactory(componentType);
      this.componentRef = this.container.createComponent(factory);

      const instance: FormControl = this.componentRef.instance;
      instance.id = this.id;
      instance.type = this.type;
      instance.value = this.value;
      instance.choices = this.choices;
      instance.isDisabled = this.isDisabled;
      instance.isHidden = this.isHidden;
      instance.isValid = this.isValid;
      instance.isRequired = this.isRequired;
      instance.config = this.config;

      instance.valueChanged.subscribe(e => this.valueChanged.emit(e));
    }
  }

  /**
   * On changes, update any properties
   * @param $event
   */
  ngOnChanges($event): void {
    for (let c in $event) {
      if ($event.hasOwnProperty(c)) {
        if ($event[c].isFirstChange()) {
          return;
        }
        this.componentRef.instance[c] = $event[c].currentValue;
      }
    }
  }

  /**
   * On destroy, destroy the created form control
   */
  ngOnDestroy(): void {
    if (this.componentRef) {
      this.componentRef.destroy();
      this.componentRef = null;
    }
  }

  /**
   * Gets the form control to create based on a type string, this is registered by the
   * {@link FormControlClassProviderService} using decorators on the individual form control classes
   *
   * @param {string} type
   * @returns {Type<FormControl>}
   */
  private _getComponentType(type: string): Type<FormControl> {
    return this._formControlClassProvider.getFormControlClass(type) || StaticTextComponent;
  }
}
