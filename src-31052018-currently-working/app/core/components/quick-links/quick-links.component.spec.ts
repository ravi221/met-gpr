import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {Component, DebugElement} from '@angular/core';
import {QuickLinksComponent} from './quick-links.component';
import {NavigatorService} from '../../../navigation/services/navigator.service';
import {RouterTestingModule} from '@angular/router/testing';
import {CardComponent} from '../../../ui-controls/components/card/card.component';
import {LoadingIconComponent} from '../../../ui-controls/components/loading-icon/loading-icon.component';
import {DetailCardComponent} from '../../../ui-controls/components/detail-card/detail-card.component';
import {IconComponent} from '../../../ui-controls/components/icon/icon.component';
import {By} from '@angular/platform-browser';
import {click} from '../../../../assets/test/TestHelper';
import {IQuickLink} from '../../interfaces/iQuickLink';
import {MockNavigatorService} from '../../../navigation/services/navigator.service.mock';

describe('QuickLinksComponent', () => {
  let component: TestQuickLinksComponent;
  let fixture: ComponentFixture<TestQuickLinksComponent>;
  let navigator: NavigatorService;
  let quickLinks: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [
        QuickLinksComponent,
        TestQuickLinksComponent,
        CardComponent,
        LoadingIconComponent,
        DetailCardComponent,
        IconComponent
      ],
      providers: [
        {provide: NavigatorService, useClass: MockNavigatorService}
      ]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(TestQuickLinksComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        quickLinks = fixture.debugElement.query(By.css('.quick-links-list'));
        navigator = TestBed.get(NavigatorService);
      });
  }));

  afterEach(() => {
    if (fixture) {
      fixture.destroy();
    }
  });

  it('should create a list of links', () => {
    expect(quickLinks).toBeTruthy();
    expect(quickLinks.children).toBeTruthy();
    expect(quickLinks.children.length).toEqual(2);
  });

  it('should navigate to a quick link when clicked', () => {
    const spy = spyOn(navigator, 'goToUrl').and.stub();
    const firstQuickLink = quickLinks.children[0];
    click(firstQuickLink, fixture);
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith('test.url');
  });

  @Component({
    template: `
      <gpr-quick-links [quickLinks]="quickLinks"></gpr-quick-links>`
  })
  class TestQuickLinksComponent {
    public quickLinks: IQuickLink[] = [
      <IQuickLink>{label: 'Test', url: 'test.url'},
      <IQuickLink>{label: 'Test 2', url: 'test.url2'}
    ];
  }
});
