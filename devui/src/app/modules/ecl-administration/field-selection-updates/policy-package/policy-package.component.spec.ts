import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicyPackageComponent } from './policy-package.component';

describe('PolicyPackageComponent', () => {
  let component: PolicyPackageComponent;
  let fixture: ComponentFixture<PolicyPackageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PolicyPackageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PolicyPackageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
