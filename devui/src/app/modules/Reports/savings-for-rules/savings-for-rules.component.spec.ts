import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SavingsForRulesComponent } from './savings-for-rules.component';

describe('SavingsForRulesComponent', () => {
  let component: SavingsForRulesComponent;
  let fixture: ComponentFixture<SavingsForRulesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SavingsForRulesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SavingsForRulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
