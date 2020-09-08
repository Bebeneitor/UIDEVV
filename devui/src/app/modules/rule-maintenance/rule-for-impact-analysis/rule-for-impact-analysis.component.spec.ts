import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RuleForImpactAnalysisComponent } from './rule-for-impact-analysis.component';

describe('RuleForImpactAnalysisComponent', () => {
  let component: RuleForImpactAnalysisComponent;
  let fixture: ComponentFixture<RuleForImpactAnalysisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RuleForImpactAnalysisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RuleForImpactAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
