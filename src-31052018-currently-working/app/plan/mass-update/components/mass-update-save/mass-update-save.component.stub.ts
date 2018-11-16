import DataManager from '../../../../dynamic-form/classes/data-manager';
import {Component, Input, OnInit} from '@angular/core';
import {MassUpdateSaveComponent} from './mass-update-save.component';

/**
 * Stub of {@link MassUpdateSaveComponent}
 */
@Component({selector: 'gpr-mass-update-save', template: ``})
export class MassUpdateSaveStubComponent extends MassUpdateSaveComponent implements OnInit {
  @Input() model: DataManager;
  @Input() customerNumber: number;
  @Input() planId: string;
  @Input() planStatus: string;

  ngOnInit() {}
}
