import {async, ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import {SearchOverlayComponent} from './search-overlay.component';
import {DebugElement} from '@angular/core';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {By} from '@angular/platform-browser';
import {NavigatorService} from '../../../navigation/services/navigator.service';
import {click} from '../../../../assets/test/TestHelper';
import {SearchPageStubComponent} from '../search-page/search-page.component.stub';
import {SlideMenuComponent} from '../../../ui-controls/components/slide-menu/slide-menu.component';
import {RouterTestingModule} from '@angular/router/testing';
import {SearchBarService} from '../../services/search-bar.service';
import {MockNavigatorService} from '../../../navigation/services/navigator.service.mock';

describe('SearchOverlayComponent', () => {
  let component: SearchOverlayComponent;
  let fixture: ComponentFixture<SearchOverlayComponent>;
  let closeBtn: DebugElement;
  let searchBarService: SearchBarService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, RouterTestingModule],
      declarations: [
        SearchOverlayComponent,
        SearchPageStubComponent,
        SlideMenuComponent
      ],
      providers: [
        {provide: NavigatorService, useClass: MockNavigatorService},
        SearchBarService
      ]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(SearchOverlayComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        closeBtn = fixture.debugElement.query(By.css('.close-search-overlay'));
        searchBarService = TestBed.get(SearchBarService);
      });
  }));

  afterEach(() => {
    if (fixture) {
      fixture.destroy();
    }
  });

  describe('Opening/closing search overlay', () => {

    it('should open when search button is clicked', fakeAsync(() => {
      component.openSearchOverlay();
      expect(component.slideMenu.slideMenu.isOpening).toBeTruthy();

      tick(550);
      expect(component.slideMenu.slideMenu.state).toBe('visible');
      expect(component.slideMenu.slideMenu.isOpening).toBeFalsy();
    }));

    it('should focus the search bar when opening the search overlay', () => {
      const spy = spyOn(searchBarService, 'focus').and.stub();
      component.openSearchOverlay();
      expect(spy).toHaveBeenCalled();
    });

    it('should close when close button is clicked', fakeAsync(() => {
      component.openSearchOverlay();
      tick(550);
      expect(component.slideMenu.slideMenu.state).toBe('visible');

      click(closeBtn);
      tick(550);
      expect(component.slideMenu.slideMenu.state).toBe('hidden-top');
    }));
  });
});
