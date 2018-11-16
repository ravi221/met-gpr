import {LogService} from './log.service';
import {environment} from '../../../environments/environment';

describe('LogService', () => {
  let service: LogService;

  describe('Enabled logging', () => {
    beforeAll(() => {
      environment.production = false;
      service = new LogService();
    });

    it('should call console.log', () => {
      const spy = spyOn(console, 'log').and.stub();
      service.log('Test');
      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledWith('Test');
    });

    it('should call console.warn', () => {
      const spy = spyOn(console, 'warn').and.stub();
      service.warn('Test');
      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledWith('Test');
    });

    it('should call console.info', () => {
      const spy = spyOn(console, 'info').and.stub();
      service.info('Test');
      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledWith('Test');
    });

    it('should call console.error', () => {
      const spy = spyOn(console, 'error').and.stub();
      service.error('Test');
      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledWith('Test');
    });

    it('should call console.debug', () => {
      const spy = spyOn(console, 'debug').and.stub();
      service.debug('Test');
      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledWith('Test');
    });
  });

  describe('Disabled logging', () => {
    beforeAll(() => {
      environment.production = true;
      service = new LogService();
    });

    it('should call console.log', () => {
      const spy = spyOn(console, 'log').and.stub();
      service.log('Test');
      expect(spy).not.toHaveBeenCalled();
    });

    it('should call console.warn', () => {
      const spy = spyOn(console, 'warn').and.stub();
      service.warn('Test');
      expect(spy).not.toHaveBeenCalled();
    });

    it('should call console.info', () => {
      const spy = spyOn(console, 'info').and.stub();
      service.info('Test');
      expect(spy).not.toHaveBeenCalled();
    });

    it('should call console.error', () => {
      const spy = spyOn(console, 'error').and.stub();
      service.error('Test');
      expect(spy).not.toHaveBeenCalled();
    });

    it('should call console.debug', () => {
      const spy = spyOn(console, 'debug').and.stub();
      service.debug('Test');
      expect(spy).not.toHaveBeenCalled();
    });

    it('should call noop when logging is disabled', () => {
      const spy = spyOn(service, '_noop').and.callThrough();
      service.log('Test');
      expect(spy).toHaveBeenCalled();
    });
  });
});
