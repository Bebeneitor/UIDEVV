import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MdApprovalComponent } from './md-approval.component';

describe('MdApprovalComponent', () => {
  let component: MdApprovalComponent;
  let fixture: ComponentFixture<MdApprovalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MdApprovalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MdApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
