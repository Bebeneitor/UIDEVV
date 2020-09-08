import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignmentMdApprovalComponent } from './assignment-md-approval.component';

describe('AssignmentMdApprovalComponent', () => {
  let component: AssignmentMdApprovalComponent;
  let fixture: ComponentFixture<AssignmentMdApprovalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignmentMdApprovalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignmentMdApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
