import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MidRuleComponent } from './mid-rule.component';

describe('MidRuleComponent', () => {
  let component: MidRuleComponent;
  let fixture: ComponentFixture<MidRuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MidRuleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MidRuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
