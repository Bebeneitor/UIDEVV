import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RuleHistoryComponent } from './rule-history.component';

describe('RuleHistoryComponent', () => {
  let component: RuleHistoryComponent;
  let fixture: ComponentFixture<RuleHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RuleHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RuleHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
