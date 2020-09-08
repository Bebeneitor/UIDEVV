import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DecisionPointComponent } from './decision-point.component';

describe('DecisionPointComponent', () => {
  let component: DecisionPointComponent;
  let fixture: ComponentFixture<DecisionPointComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DecisionPointComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DecisionPointComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
