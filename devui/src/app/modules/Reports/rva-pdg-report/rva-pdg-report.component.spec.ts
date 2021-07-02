import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RvaPdgReportComponent } from './rva-pdg-report.component';

describe('RvaPdgReportComponent', () => {
  let component: RvaPdgReportComponent;
  let fixture: ComponentFixture<RvaPdgReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RvaPdgReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RvaPdgReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
