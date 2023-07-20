import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppinvitationComponent } from './appinvitation.component';

describe('AppinvitationComponent', () => {
  let component: AppinvitationComponent;
  let fixture: ComponentFixture<AppinvitationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppinvitationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppinvitationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
