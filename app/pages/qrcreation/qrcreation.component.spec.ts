import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QRCreationComponent } from './qrcreation.component';

describe('QRCreationComponent', () => {
  let component: QRCreationComponent;
  let fixture: ComponentFixture<QRCreationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QRCreationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QRCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
