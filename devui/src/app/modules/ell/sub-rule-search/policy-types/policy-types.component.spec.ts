import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicyTypesComponent } from './policy-types.component';

describe('PolicyTypesComponent', () => {
  let component: PolicyTypesComponent;
  let fixture: ComponentFixture<PolicyTypesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PolicyTypesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PolicyTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
