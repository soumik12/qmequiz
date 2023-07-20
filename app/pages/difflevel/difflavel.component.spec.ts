import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DifflavelComponent } from './difflavel.component';

describe('DifflavelComponent', () => {
  let component: DifflavelComponent;
  let fixture: ComponentFixture<DifflavelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DifflavelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DifflavelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
