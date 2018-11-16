import {DebugElement, Type} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {INavState} from '../../app/navigation/interfaces/iNavState';
import {PageAccessType} from '../../app/core/enums/page-access-type';
import {NavContextType} from '../../app/navigation/enums/nav-context';

/**
 * Clicks the element
 * @param {DebugElement | HTMLElement} el
 * @param {ComponentFixture<any>} fixture
 */
export function click(el: DebugElement | HTMLElement, fixture?: ComponentFixture<any>): void {
  if (el instanceof HTMLElement) {
    el.click();
  } else {
    el.triggerEventHandler('click', null);
  }
  if (fixture) {
    fixture.detectChanges();
  }
}
