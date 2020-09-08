import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferenceDataAcquisitionComponent } from './reference-data-acquisition.component';

describe('ReferenceDataAcquisitionComponent', () => {
  let component: ReferenceDataAcquisitionComponent;
  let fixture: ComponentFixture<ReferenceDataAcquisitionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReferenceDataAcquisitionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferenceDataAcquisitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
