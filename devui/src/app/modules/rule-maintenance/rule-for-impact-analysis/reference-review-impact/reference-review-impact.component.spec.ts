import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferenceReviewImpactComponent } from './reference-review-impact.component';

describe('ReferenceReviewImpactComponent', () => {
  let component: ReferenceReviewImpactComponent;
  let fixture: ComponentFixture<ReferenceReviewImpactComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReferenceReviewImpactComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferenceReviewImpactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
