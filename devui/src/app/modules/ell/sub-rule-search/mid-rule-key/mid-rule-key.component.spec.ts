import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MidRuleKeyComponent } from './mid-rule-key.component';

describe('MidRuleKeyComponent', () => {
  let component: MidRuleKeyComponent;
  let fixture: ComponentFixture<MidRuleKeyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MidRuleKeyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MidRuleKeyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
