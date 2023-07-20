import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamwiseDetailComponent } from './teamwise-detail.component';

describe('TeamwiseDetailComponent', () => {
  let component: TeamwiseDetailComponent;
  let fixture: ComponentFixture<TeamwiseDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeamwiseDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamwiseDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
