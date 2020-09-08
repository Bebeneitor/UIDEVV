import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReassignProvisionalRulesComponent } from './reassign-provisional-rules.component';

describe('ReassignProvisionalRulesComponent', () => {
  let component: ReassignProvisionalRulesComponent;
  let fixture: ComponentFixture<ReassignProvisionalRulesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReassignProvisionalRulesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReassignProvisionalRulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
