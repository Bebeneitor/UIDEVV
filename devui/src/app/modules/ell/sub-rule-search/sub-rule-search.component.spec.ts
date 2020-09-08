import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubRuleSearchComponent } from './sub-rule-search.component';

describe('SubRuleSearchComponent', () => {
  let component: SubRuleSearchComponent;
  let fixture: ComponentFixture<SubRuleSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubRuleSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubRuleSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
