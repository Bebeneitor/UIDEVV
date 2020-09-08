import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubRuleDetailComponent } from './sub-rule-detail.component';

describe('SubRuleDetailComponent', () => {
  let component: SubRuleDetailComponent;
  let fixture: ComponentFixture<SubRuleDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubRuleDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubRuleDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
