import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RulesImplementedComponent } from './rules-implemented.component';

describe('RulesImplementedComponent', () => {
  let component: RulesImplementedComponent;
  let fixture: ComponentFixture<RulesImplementedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RulesImplementedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RulesImplementedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
