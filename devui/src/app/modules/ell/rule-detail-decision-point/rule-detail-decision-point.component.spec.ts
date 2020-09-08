import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RuleDetailDecisionPointComponent } from './rule-detail-decision-point.component';

describe('RuleDetailDecisionPointComponent', () => {
  let component: RuleDetailDecisionPointComponent;
  let fixture: ComponentFixture<RuleDetailDecisionPointComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RuleDetailDecisionPointComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RuleDetailDecisionPointComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
