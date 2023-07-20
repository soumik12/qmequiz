import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpinionbasedComponent } from './opinionbased.component';

describe('OpinionbasedComponent', () => {
  let component: OpinionbasedComponent;
  let fixture: ComponentFixture<OpinionbasedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpinionbasedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpinionbasedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
