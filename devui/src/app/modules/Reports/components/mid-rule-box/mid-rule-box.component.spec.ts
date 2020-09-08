import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MidRuleBoxComponent } from './mid-rule-box.component';

describe('MidRuleBoxComponent', () => {
  let component: MidRuleBoxComponent;
  let fixture: ComponentFixture<MidRuleBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MidRuleBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MidRuleBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});