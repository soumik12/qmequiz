import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditgameQuestionComponent } from './editgame-question.component';

describe('EditgameQuestionComponent', () => {
  let component: EditgameQuestionComponent;
  let fixture: ComponentFixture<EditgameQuestionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditgameQuestionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditgameQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
