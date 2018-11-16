import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {CardComponent} from '../card/card.component';
import {Component, DebugElement} from '@angular/core';
import {DetailCardComponent} from './detail-card.component';
import {IconComponent} from '../icon/icon.component';
import {LoadingIconComponent} from '../loading-icon/loading-icon.component';

describe('DetailCardComponent', () => {
  let component: TestDetailCardComponent;
  let fixture: ComponentFixture<TestDetailCardComponent>;
  let heading: DebugElement;
  let headingIcon: DebugElement;
  let headingCount: DebugElement;

  function updateFixture() {
    fixture.detectChanges();
    heading = fixture.debugElement.query(By.css('.detail-heading'));
    headingIcon = fixture.debugElement.query(By.css('img'));
    headingCount = fixture.debugElement.query(By.css('.detail-heading-count'));
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        TestDetailCardComponent,
        DetailCardComponent,
        IconComponent,
        CardComponent,
        LoadingIconComponent
      ],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(TestDetailCardComponent);
        component = fixture.componentInstance;
        updateFixture();
      });
  }));

  afterEach(() => {
    if (fixture) {
      fixture.destroy();
    }
  });

  it('should render heading, icon, and count', () => {
    expect(heading).toBeTruthy();
    expect(heading.nativeElement.innerText).toBe('Test');
    expect(headingIcon).toBeTruthy();
    expect(headingCount).toBeTruthy();
    expect(headingCount.nativeElement.innerText).toBe('4');
  });

  it('should render content inside of detail card', () => {
    const content = fixture.debugElement.query(By.css('.test-content'));
    expect(content).toBeTruthy();
  });

  it('should not render icon when nil', () => {
    component.headingIcon = null;
    updateFixture();
    expect(headingIcon).toBeNull();

    component.headingIcon = undefined;
    updateFixture();
    expect(headingIcon).toBeNull();
  });

  it('should not render heading count when show heading count is false', () => {
    component.showHeadingCount = false;
    updateFixture();
    expect(headingCount).toBeNull();
  });

  @Component({
    template: `
      <gpr-detail-card [heading]="heading"
                       [headingIcon]="headingIcon"
                       [headingCount]="headingCount"
                       [showHeadingCount]="showHeadingCount">
        <div class="test-content"></div>
      </gpr-detail-card>`
  })
  class TestDetailCardComponent {
    public heading = 'Test';
    public headingIcon = 'flag';
    public headingCount = 4;
    public showHeadingCount = true;
  }
});
