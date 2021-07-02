import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProvisionalRuleIndividualCodesComponent } from './provisional-rule-individual-codes.component';

describe('ProvisionalRuleIndividualCodesComponent', () => {
  let component: ProvisionalRuleIndividualCodesComponent;
  let fixture: ComponentFixture<ProvisionalRuleIndividualCodesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProvisionalRuleIndividualCodesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProvisionalRuleIndividualCodesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
