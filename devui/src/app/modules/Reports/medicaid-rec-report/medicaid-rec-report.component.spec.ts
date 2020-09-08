import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MedicaidRecReportComponent } from './medicaid-rec-report.component';

describe('MedicaidRecReportComponent', () => {
  let component: MedicaidRecReportComponent;
  let fixture: ComponentFixture<MedicaidRecReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MedicaidRecReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MedicaidRecReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});