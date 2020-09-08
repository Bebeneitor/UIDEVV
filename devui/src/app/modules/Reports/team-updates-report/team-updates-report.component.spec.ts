import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamUpdatesReportComponent } from './team-updates-report.component';

describe('TeamUpdatesReportComponent', () => {
  let component: TeamUpdatesReportComponent;
  let fixture: ComponentFixture<TeamUpdatesReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeamUpdatesReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamUpdatesReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
