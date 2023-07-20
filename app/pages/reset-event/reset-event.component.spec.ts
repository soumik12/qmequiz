import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetEventComponent } from './reset-event.component';

describe('ResetEventComponent', () => {
  let component: ResetEventComponent;
  let fixture: ComponentFixture<ResetEventComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResetEventComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResetEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
