import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditparticipantsComponent } from './editparticipants.component';

describe('EditparticipantsComponent', () => {
  let component: EditparticipantsComponent;
  let fixture: ComponentFixture<EditparticipantsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditparticipantsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditparticipantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
