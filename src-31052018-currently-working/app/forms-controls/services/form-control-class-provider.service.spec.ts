import {FormControlClassProviderService} from './form-control-class-provider.service';
import {FormControl} from '../components/form-control';

describe('FormControlClassProviderService', () => {
  let service: FormControlClassProviderService = new FormControlClassProviderService();

  it('should return a registered class by an alias', () => {
    const testClass = service.getFormControlClass('testClass');
    expect(testClass).toBeTruthy();
  });

  it('should return a registered class by yet another alias', () => {
    const testClass = service.getFormControlClass('testAlias');
    expect(testClass).toBeTruthy();
  });

  @FormControlClassProviderService.Register(['testClass', 'testAlias'])
  class TestControlClass extends FormControl {
    constructor() {
      super();
    }
  }
});



