import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResearchRequestSearchRuleIdsComponent } from './research-request-search-rule-ids.component';

describe('ResearchRequestSearchRuleIdsComponent', () => {
  let component: ResearchRequestSearchRuleIdsComponent;
  let fixture: ComponentFixture<ResearchRequestSearchRuleIdsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResearchRequestSearchRuleIdsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResearchRequestSearchRuleIdsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
