import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GamequestionMCMSComponent } from './gamequestion-mcms.component';

describe('GamequestionMCMSComponent', () => {
  let component: GamequestionMCMSComponent;
  let fixture: ComponentFixture<GamequestionMCMSComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GamequestionMCMSComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GamequestionMCMSComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
