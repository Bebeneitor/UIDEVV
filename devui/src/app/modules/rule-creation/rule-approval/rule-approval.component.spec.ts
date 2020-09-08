import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RuleApprovalComponent } from './rule-approval.component';

describe('RuleApprovalComponent', () => {
  let component: RuleApprovalComponent;
  let fixture: ComponentFixture<RuleApprovalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RuleApprovalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RuleApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
