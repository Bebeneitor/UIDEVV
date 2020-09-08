import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SameSimAnalysisComponent } from './same-sim-analysis.component';

describe('SameSimAnalysisComponent', () => {
  let component: SameSimAnalysisComponent;
  let fixture: ComponentFixture<SameSimAnalysisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SameSimAnalysisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SameSimAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
