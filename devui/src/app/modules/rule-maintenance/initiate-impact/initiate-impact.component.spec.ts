import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InitiateImpactComponent } from './initiate-impact.component';

describe('InitiateImpactComponent', () => {
  let component: InitiateImpactComponent;
  let fixture: ComponentFixture<InitiateImpactComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InitiateImpactComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InitiateImpactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
