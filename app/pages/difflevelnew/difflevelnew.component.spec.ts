import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DifflevelnewComponent } from './difflevelnew.component';

describe('DifflevelnewComponent', () => {
  let component: DifflevelnewComponent;
  let fixture: ComponentFixture<DifflevelnewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DifflevelnewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DifflevelnewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
