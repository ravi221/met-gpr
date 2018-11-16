import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {click} from '../../../../assets/test/TestHelper';
import {Component, DebugElement, ViewChild} from '@angular/core';
import {IconComponent} from '../../../ui-controls/components/icon/icon.component';
import {Location} from '@angular/common';
import {LogoutService} from '../../services/logout.service';
import {ModalService} from '../../../ui-controls/services/modal.service';
import {NavBarComponent} from './nav-bar.component';
import {NavBarService} from '../../services/nav-bar.service';
import {NavContextType} from '../../enums/nav-context';
import {NavigatorService} from '../../services/navigator.service';
import {ProgressBarComponent} from '../../../ui-controls/components/progress-bar/progress-bar.component';
import {ProgressService} from '../../../ui-controls/services/progress.service';
import {RouterTestingModule} from '@angular/router/testing';

describe('NavBarComponent', () => {
  let component: TestNavBarComponent;
  let fixture: ComponentFixture<TestNavBarComponent>;
  let navBarService: NavBarService;
  let navLinks: DebugElement[];

  function updateNavLinks(navContextType: NavContextType): void {
    component.navBar.navLinkVisibility = navBarService.getNavLinkVisibility(navContextType);
    fixture.detectChanges();
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [
        IconComponent,
        NavBarComponent,
        ProgressBarComponent,
        TestNavBarComponent,
      ],
      providers: [
        Location,
        LogoutService,
        ModalService,
        NavBarService,
        ProgressService,
        {provide: NavigatorService, useClass: MockNavigatorService}
      ]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(TestNavBarComponent);
        component = fixture.componentInstance;
        navBarService = TestBed.get(NavBarService);

        updateNavLinks(NavContextType.DEFAULT);
        navLinks = fixture.debugElement.queryAll(By.css('.nav-link'));
      });
  }));

  afterEach(() => {
    if (fixture) {
      fixture.destroy();
    }
  });

  describe('Event Emitters', () => {
    it('should emit open slide menu when main menu icon is clicked', () => {
      const spy = spyOn(component, 'onOpenSlideMenu').and.stub();
      const mainMenuLink = navLinks[0].query(By.css('a'));
      click(mainMenuLink);
      expect(spy).toHaveBeenCalled();
    });

    it('should emit open search overlay event when search icon is clicked', () => {
      const spy = spyOn(component, 'onOpenSearchOverlay').and.stub();
      const searchLink = navLinks[4].query(By.css('a'));
      click(searchLink);
      expect(spy).toHaveBeenCalled();
    });

    it('should emit open logout when logout is clicked', () => {
      const spy = spyOn(component, 'onOpenLogout').and.stub();
      const logoutLink = navLinks[5].query(By.css('a'));
      click(logoutLink);
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('Navigation', () => {
    let navigator: NavigatorService;

    beforeEach(() => {
      navigator = TestBed.get(NavigatorService);
    });

    it('should navigate to flag home when \'FLAGS\' is clicked', () => {
      const spy = spyOn(navigator, 'goToFlagHome').and.stub();
      updateNavLinks(NavContextType.FLAGS);
      const flagLink = navLinks[2].query(By.css('a'));
      click(flagLink);
      expect(spy).toHaveBeenCalled();
    });

    it('should navigate to history home when \'HISTORY\' is clicked', () => {
      const spy = spyOn(navigator, 'goToHistoryHome').and.stub();
      updateNavLinks(NavContextType.CUSTOMER);
      const historyLink = navLinks[3].query(By.css('a'));
      click(historyLink);
      expect(spy).toHaveBeenCalled();
    });

    it('should navigate to gpr home when the MetLife icon is clicked', () => {
      const spy = spyOn(navigator, 'goToUrl').and.stub();
      updateNavLinks(NavContextType.CUSTOMER);
      const metLifeLogoLink = fixture.debugElement.query(By.css('.brand-icon'));
      click(metLifeLogoLink);
      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledWith('/');
    });
  });

  describe('Displaying Links', () => {
    it('should display all links when all are set to be visible', () => {
      component.navBar.navLinkVisibility = {
        'mainMenu': true,
        'back': true,
        'flags': true,
        'history': true,
        'logout': true,
        'search': true
      };
      fixture.detectChanges();
      navLinks = fixture.debugElement.queryAll(By.css('.nav-link'));
      const visibleNavLinks = navLinks.filter(li => !li.properties.hidden);
      expect(visibleNavLinks.length).toBe(6);
    });

    it('should display a subset of icons when some are set to be visible', () => {
      component.navBar.navLinkVisibility = {
        'mainMenu': true,
        'back': false,
        'flags': true,
        'history': false,
        'logout': true,
        'search': false
      };
      fixture.detectChanges();
      navLinks = fixture.debugElement.queryAll(By.css('.nav-link'));
      const visibleNavLinks = navLinks.filter(li => !li.properties.hidden);
      expect(visibleNavLinks.length).toBe(3);
    });

    it('should display all the correct names for nav links', () => {
      const expectedNavLinkNames = ['GPR MENU', '', 'FLAGS', 'HISTORY', 'SEARCH', 'LOGOUT'];
      const navLinkAnchors = fixture.debugElement.queryAll(By.css('.nav-link a'));
      const actualNavLinkNames = navLinkAnchors.map(a => a.nativeElement.innerText.trim());
      actualNavLinkNames.forEach((actualNavLinkName, index) => {
        expect(actualNavLinkName).toBe(expectedNavLinkNames[index]);
      });
    });
  });

  @Component({
    template: `
      <gpr-nav-bar (openSlideMenu)="onOpenSlideMenu()"
                   (openSearchOverlay)="onOpenSearchOverlay()"
                   (openLogout)="onOpenLogout()"></gpr-nav-bar>
    `
  })
  class TestNavBarComponent {
    @ViewChild(NavBarComponent) navBar;

    public onOpenSlideMenu() {

    }

    public onOpenSearchOverlay() {

    }

    public onOpenLogout() {

    }
  }

  class MockNavigatorService {
    goToFlagHome() {
    }

    goToHistoryHome() {
    }

    goToUrl() {
    }

    subscribe() {
      return {
        context: NavContextType.DEFAULT
      };
    }

    unsubscribe() {
    }
  }
});
