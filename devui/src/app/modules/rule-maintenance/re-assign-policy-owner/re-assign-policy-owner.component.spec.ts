import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReAssignPolicyOwnerComponent } from './re-assign-policy-owner.component';

describe('ReAssignPolicyOwnerComponent', () => {
  let component: ReAssignPolicyOwnerComponent;
  let fixture: ComponentFixture<ReAssignPolicyOwnerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReAssignPolicyOwnerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReAssignPolicyOwnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
