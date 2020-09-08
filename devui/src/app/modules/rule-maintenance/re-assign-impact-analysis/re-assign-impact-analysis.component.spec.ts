import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReAssignImpactAnalysisComponent } from './re-assign-impact-analysis.component';

describe('ReAssignImpactAnalysisComponent', () => {
  let component: ReAssignImpactAnalysisComponent;
  let fixture: ComponentFixture<ReAssignImpactAnalysisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReAssignImpactAnalysisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReAssignImpactAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
