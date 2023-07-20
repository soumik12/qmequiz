import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionwiseDetailComponent } from './questionwise-detail.component';

describe('QuestionwiseDetailComponent', () => {
  let component: QuestionwiseDetailComponent;
  let fixture: ComponentFixture<QuestionwiseDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionwiseDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionwiseDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
