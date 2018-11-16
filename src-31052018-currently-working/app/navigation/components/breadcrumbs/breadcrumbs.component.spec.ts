import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {BreadcrumbsComponent} from './breadcrumbs.component';
import {NavigatorService} from '../../services/navigator.service';
import {RouterTestingModule} from '@angular/router/testing';
import {IBreadcrumb} from '../../interfaces/iBreadcrumb';
import {DebugElement} from '@angular/core';
import {By} from '@angular/platform-browser';
import {BreadcrumbService} from '../../services/breadcrumb.service';
import {click} from '../../../../assets/test/TestHelper';
import {MockNavigatorService} from '../../services/navigator.service.mock';

describe('BreadcrumbsComponent', () => {
  let component: BreadcrumbsComponent;
  let fixture: ComponentFixture<BreadcrumbsComponent>;
  let navigator: NavigatorService;
  let breadcrumbService: BreadcrumbService;
  const mockBreadcrumbs: IBreadcrumb[] = [
    {label: 'Home', path: '/home'},
    {label: 'My Parents', path: '/parents'},
    {label: 'Our Children', path: '/children'}
  ];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [BreadcrumbsComponent],
      providers: [
        {provide: NavigatorService, useClass: MockNavigatorService},
        BreadcrumbService
      ]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(BreadcrumbsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        navigator = TestBed.get(NavigatorService);
        breadcrumbService = TestBed.get(BreadcrumbService);
      });
  }));

  afterEach(() => {
    if (fixture) {
      fixture.destroy();
    }
  });

  it('should render the correct breadcrumbs on init', () => {
    const spy = spyOn(breadcrumbService, 'getBreadcrumbsFromNavState').and.returnValue(mockBreadcrumbs);
    component.ngOnInit();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalled();
    const crumbs: DebugElement[] = fixture.debugElement.queryAll(By.css('a'));
    expect(crumbs).toBeTruthy();
    expect(crumbs.length).toEqual(3);
    expect(crumbs[0].nativeElement.textContent.trim()).toContain('Home');
    expect(crumbs[1].nativeElement.textContent.trim()).toContain('My Parents');
    expect(crumbs[2].nativeElement.textContent.trim()).toContain('Our Children');
  });

  it('should handle the click event of a breadcrumb and call navigator goToUrl method with correct path', () => {
    const spy = spyOn(navigator, 'goToUrl');
    component.breadcrumbs = mockBreadcrumbs.slice(0, 1);
    fixture.detectChanges();
    const crumb: DebugElement = fixture.debugElement.query(By.css('a'));
    expect(crumb).toBeTruthy();
    expect(crumb.nativeElement.textContent.trim()).toContain('Home');

    click(crumb);
    expect(spy).toHaveBeenCalledWith(component.breadcrumbs[0].path);
  });
});
