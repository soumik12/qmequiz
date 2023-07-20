import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisteredOrganizationsComponent } from './registered-organizations.component';

describe('RegisteredOrganizationsComponent', () => {
  let component: RegisteredOrganizationsComponent;
  let fixture: ComponentFixture<RegisteredOrganizationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegisteredOrganizationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisteredOrganizationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
