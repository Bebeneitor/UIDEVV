import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResearchRequestAdvisoryApprovalComponent } from './research-request-advisory-approval.component';

describe('ResearchRequestAdvisoryApprovalComponent', () => {
  let component: ResearchRequestAdvisoryApprovalComponent;
  let fixture: ComponentFixture<ResearchRequestAdvisoryApprovalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResearchRequestAdvisoryApprovalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResearchRequestAdvisoryApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
