import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditLogCvpComponent } from './audit-log-cvp.component';

describe('AuditLogCvpComponent', () => {
  let component: AuditLogCvpComponent;
  let fixture: ComponentFixture<AuditLogCvpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuditLogCvpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditLogCvpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
