import {TooltipPositionService} from './tooltip-position.service';
import {TooltipPosition} from '../enums/tooltip-position';

describe('TooltipPositionService', () => {
  const variation = 5;
  let fixtureElement: HTMLElement;
  let hostElement: HTMLElement;
  let targetElement: HTMLElement;
  let service: TooltipPositionService = new TooltipPositionService();

  let fixturePadding = (direction: string, amount: number) => {
    const paddingDirection = `padding${direction.charAt(0).toUpperCase()}${direction.substring(1)}`;
    fixtureElement.style[paddingDirection] = `${amount}px`;
  };

  let expectInRange = (actualValue: number, expectedValue: number) => {
    expect(actualValue).toBeGreaterThanOrEqual(expectedValue - variation);
    expect(actualValue).toBeLessThanOrEqual(expectedValue + variation);
  };

  beforeEach(() => {
    const fixture = `<div id="fixture">
      <gpr-tooltip-content id="content" #tooltipContent><p>This is the content of the tooltip.</p></gpr-tooltip-content>
      <button id="button" gprTooltip [tooltipContent]="#tooltipContent">Click me!</button>
      </div>`;

    document.body.insertAdjacentHTML(
      'afterbegin',
      fixture);

    fixtureElement = document.getElementById('fixture');
    targetElement = document.getElementById('content');
    hostElement = document.getElementById('button');
  });

  afterEach(() => {
    document.body.removeChild(document.getElementById('fixture'));
  });

  it('should get correct top position', () => {
    let pos = service.getTooltipPosition(TooltipPosition.TOP, hostElement, targetElement);
    expectInRange(pos.left, 32);
    expectInRange(pos.top, 30);

    fixturePadding('left', 10);
    pos = service.getTooltipPosition(TooltipPosition.TOP, hostElement, targetElement);
    expectInRange(pos.left, 42);
    expectInRange(pos.top, 30);

    fixturePadding('top', 10);
    pos = service.getTooltipPosition(TooltipPosition.TOP, hostElement, targetElement);
    expectInRange(pos.left, 42);
    expectInRange(pos.top, 45);
  });

  it('should get correct bottom position', () => {
    let pos = service.getTooltipPosition(TooltipPosition.BOTTOM, hostElement, targetElement);
    expectInRange(pos.left, 32);
    expectInRange(pos.top, 92);

    fixturePadding('left', 10);
    pos = service.getTooltipPosition(TooltipPosition.BOTTOM, hostElement, targetElement);
    expectInRange(pos.left, 42);
    expectInRange(pos.top, 92);

    fixturePadding('top', 10);
    pos = service.getTooltipPosition(TooltipPosition.BOTTOM, hostElement, targetElement);
    expectInRange(pos.left, 42);
    expectInRange(pos.top, 107);
  });

  it('should get correct left position', () => {
    let pos = service.getTooltipPosition(TooltipPosition.LEFT, hostElement, targetElement);
    expectInRange(pos.left, 0);
    expectInRange(pos.top, 59);

    fixturePadding('left', 10);
    pos = service.getTooltipPosition(TooltipPosition.LEFT, hostElement, targetElement);
    expectInRange(pos.left, 0);
    expectInRange(pos.top, 59);

    fixturePadding('top', 10);
    pos = service.getTooltipPosition(TooltipPosition.LEFT, hostElement, targetElement);
    expectInRange(pos.left, 0);
    expectInRange(pos.top, 74);
  });

  it('should get correct right position', () => {
    let pos = service.getTooltipPosition(TooltipPosition.RIGHT, hostElement, targetElement);
    expectInRange(pos.left, 96);
    expectInRange(pos.top, 59);

    fixturePadding('left', 10);
    pos = service.getTooltipPosition(TooltipPosition.RIGHT, hostElement, targetElement);
    expectInRange(pos.left, 106);
    expectInRange(pos.top, 59);

    fixturePadding('top', 10);
    pos = service.getTooltipPosition(TooltipPosition.RIGHT, hostElement, targetElement);
    expectInRange(pos.left, 106);
    expectInRange(pos.top, 74);
  });
});
