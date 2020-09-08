import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SavingClientAdoptedRuleComponent } from './saving-client-adopted-rule.component';

describe('SavingClientAdoptedRuleComponent', () => {
  let component: SavingClientAdoptedRuleComponent;
  let fixture: ComponentFixture<SavingClientAdoptedRuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SavingClientAdoptedRuleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SavingClientAdoptedRuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
