import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeprecatedRulesComponent } from './deprecated-rules.component';

describe('DeprecatedRulesComponent', () => {
  let component: DeprecatedRulesComponent;
  let fixture: ComponentFixture<DeprecatedRulesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeprecatedRulesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeprecatedRulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
