import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ProvisionalRuleProvidersComponent } from './provisional-rule-providers.component';

describe('ProvisionalRuleProvidersComponent', () => {
  let component: ProvisionalRuleProvidersComponent;
  let fixture: ComponentFixture<ProvisionalRuleProvidersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProvisionalRuleProvidersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProvisionalRuleProvidersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
