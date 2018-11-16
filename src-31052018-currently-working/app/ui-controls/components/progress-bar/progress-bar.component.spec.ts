import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {ProgressBarComponent} from './progress-bar.component';
import {DebugElement} from '@angular/core';
import {By} from '@angular/platform-browser';
import {ProgressService} from '../../services/progress.service';

describe('ProgressBarComponent', () => {
  let component: ProgressBarComponent;
  let fixture: ComponentFixture<ProgressBarComponent>;
  let service: ProgressService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProgressBarComponent],
      providers: [ProgressService]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(ProgressBarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        service = TestBed.get(ProgressService);
      });
  }));

  afterEach(() => {
    if (fixture) {
      fixture.destroy();
    }
  });

  it('should apply the correct mode name as a class name', () => {
    const expected = 'determinate';
    component.mode = expected;
    fixture.detectChanges();
    const progressEl: DebugElement = fixture.debugElement.query(By.css('.progress'));
    expect(progressEl).toBeTruthy();
    const barEl: DebugElement = progressEl.children[0];
    expect(barEl).toBeTruthy();
    expect(barEl.nativeElement.classList).toContain(expected);
  });

  it('should render the correct opacity based when progress service is active', async(() => {
    service.addTransaction('testId', 'test/url', 'GET');
    fixture.whenStable()
      .then(() => {
        fixture.detectChanges();
        const progressEl: DebugElement = fixture.debugElement.query(By.css('.progress'));
        expect(progressEl.nativeElement.style.opacity).toEqual('1');
        service.removeTransaction('testId');
      });
  }));

  it('should render the correct opacity based when progress service is inactive', async(() => {
    service.addTransaction('testId', 'test/url', 'GET');
    service.removeTransaction('testId');

    fixture.whenStable()
      .then(() => {
        fixture.detectChanges();
        const progressEl: DebugElement = fixture.debugElement.query(By.css('.progress'));
        expect(progressEl.nativeElement.style.opacity).toEqual('0');
      });
  }));

  it('should render the correct width of the progress based on the value of the observed progress', async(() => {
    service.addTransaction('testId', 'test/url', 'GET');
    service.addTransaction('testId2', 'test/url', 'GET');

    fixture.whenStable()
      .then(() => {
        service.removeTransaction('testId');
      })
      .then(() => {
        fixture.detectChanges();
        const progressEl: DebugElement = fixture.debugElement.query(By.css('.progress'));
        const barEl: DebugElement = progressEl.children[0];
        expect(barEl.nativeElement.style.width).toEqual('50%');
        service.removeTransaction('testId2');
      });
  }));

});
