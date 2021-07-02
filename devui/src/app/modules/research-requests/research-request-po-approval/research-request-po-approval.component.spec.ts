import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResearchRequestPoApprovalComponent } from './research-request-po-approval.component';

describe('ResearchRequestPoApprovalComponent', () => {
  let component: ResearchRequestPoApprovalComponent;
  let fixture: ComponentFixture<ResearchRequestPoApprovalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResearchRequestPoApprovalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResearchRequestPoApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
