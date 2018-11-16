import {IModalConfig} from '../interfaces/iModalConfig';
import {ModalContentType} from '../models/modal-content-type';
import {Observable} from 'rxjs/Observable';

/**
 * A mock service for {@link ModalService}
 */
export class MockModalService {

  constructor() {
  }

  public open(content: ModalContentType, options: IModalConfig = {}): any {
    return {
      onClose: Observable.of(false)
    };
  }
}
