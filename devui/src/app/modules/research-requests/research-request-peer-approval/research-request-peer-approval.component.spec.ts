import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResearchRequestPeerApprovalComponent } from './research-request-peer-approval.component';

describe('ResearchRequestPeerApprovalComponent', () => {
  let component: ResearchRequestPeerApprovalComponent;
  let fixture: ComponentFixture<ResearchRequestPeerApprovalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResearchRequestPeerApprovalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResearchRequestPeerApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
