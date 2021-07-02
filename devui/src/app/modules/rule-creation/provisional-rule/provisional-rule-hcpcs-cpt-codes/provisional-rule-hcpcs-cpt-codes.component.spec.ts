import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProvisionalRuleHcpcsCptCodesComponent } from './provisional-rule-hcpcs-cpt-codes.component';

describe('ProvisionalRuleHcpcsCptCodesComponent', () => {
  let component: ProvisionalRuleHcpcsCptCodesComponent;
  let fixture: ComponentFixture<ProvisionalRuleHcpcsCptCodesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProvisionalRuleHcpcsCptCodesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProvisionalRuleHcpcsCptCodesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
