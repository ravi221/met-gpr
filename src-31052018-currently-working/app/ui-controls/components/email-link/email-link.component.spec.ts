import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailLinkComponent } from './email-link.component';

describe('EmailLinkComponent', () => {
  let component: EmailLinkComponent;
  let fixture: ComponentFixture<EmailLinkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailLinkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('Email Link should be created', () => {
    expect(component).toBeTruthy();
  });
  it('MailTo should be formatted correctly', () => {
    component.body = 'Some body';
    component.emailAddress = 'Some email';
    component.subject = 'Some Subject';
    component.ngOnInit();
    expect(component.mailToString).toEqual('mailto:Some email?Subject=Some Subject&body=Some body');
  });
});
