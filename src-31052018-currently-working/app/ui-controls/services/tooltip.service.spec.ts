import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {TooltipService} from './tooltip.service';
import {TooltipContentComponent} from '../components/tooltip/tooltip-content.component';
import {TooltipPositionService} from './tooltip-position.service';

describe('TooltipService', () => {
  let component: TooltipContentComponent;
  let fixture: ComponentFixture<TooltipContentComponent>;
  let service: TooltipService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TooltipContentComponent],
      providers: [TooltipService, TooltipPositionService]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(TooltipContentComponent);
        component = fixture.componentInstance;
        component.htmlElement = document.createElement('button');
        let el = document.createTextNode('test');
        component.htmlElement.appendChild(el);
        component.htmlElement.setAttribute('offsetWidth', '100px');
        component.htmlElement.setAttribute('offsetHeight', '100px');
        fixture.detectChanges();
        service = TestBed.get(TooltipService);
        service.tooltips = [];
      });
  }));

  afterEach(() => {
    fixture.destroy();
  });

  it('should create a new tooltip', () => {
    const newTooltip = service.create(component);
    expect(newTooltip.isVisible).toBeFalsy();
    expect(service.tooltips.length).toBe(1);
  });

  it('should create multiple tooltips', () => {
    const tooltipCount = 4;
    for (let i = 0; i < tooltipCount; i++) {
      service.create(component);
    }
    expect(service.tooltips.length).toEqual(tooltipCount);
  });

  it('should toggle the visibility of different tooltips', () => {
    const newTooltip1 = service.create(component);
    const newTooltip2 = service.create(component);
    service.toggle(newTooltip1);
    service.toggle(newTooltip2);
    expect(newTooltip1.isVisible).toBeFalsy();
    expect(newTooltip2.isVisible).toBeTruthy();
  });

  it('should remove tooltips', () => {
    const newTooltip1 = service.create(component);
    const newTooltip2 = service.create(component);
    service.destroy(newTooltip1);
    expect(service.tooltips.length).toEqual(1);

    const newTooltip3 = service.create(component);
    service.destroy(newTooltip2);
    expect(service.tooltips.length).toEqual(1);

    service.destroy(newTooltip3);
    expect(service.tooltips.length).toEqual(0);
  });

  it('should not remove a tooltip that is nil', () => {
    service.create(component);
    service.destroy(null);
    expect(service.tooltips.length).toEqual(1);

    service.destroy(undefined);
    expect(service.tooltips.length).toEqual(1);
  });

  it('should not remove a tooltip that is not tracked inside of tooltips', () => {
    service.create(component);
    service.destroy({id: '1', tooltipContent: null, isVisible: false});
    expect(service.tooltips.length).toEqual(1);
  });
});
