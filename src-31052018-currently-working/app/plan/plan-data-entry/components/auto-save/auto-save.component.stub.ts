import {Component, Input, OnInit} from '@angular/core';
import DataManager from '../../../../dynamic-form/classes/data-manager';
import {AutoSaveComponent} from './auto-save.component';
import {Observable} from 'rxjs/Observable';

/**
 * Stub of {@link AutoSaveComponent}
 */
@Component({selector: 'gpr-auto-save', template: ``})
export class AutoSaveStubComponent extends AutoSaveComponent implements OnInit {
  @Input() model: DataManager;
  @Input() customerNumber: number;
  @Input() planId: string;
  @Input() planStatus: string;

  ngOnInit() {}
}
