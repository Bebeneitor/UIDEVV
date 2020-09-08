import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PayerRuleComponent } from './payer-rule.component';

describe('PayerRuleComponent', () => {
  let component: PayerRuleComponent;
  let fixture: ComponentFixture<PayerRuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayerRuleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayerRuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
