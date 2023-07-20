import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GamequestionComponent } from './gamequestion.component';

describe('GamequestionComponent', () => {
  let component: GamequestionComponent;
  let fixture: ComponentFixture<GamequestionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GamequestionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GamequestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
