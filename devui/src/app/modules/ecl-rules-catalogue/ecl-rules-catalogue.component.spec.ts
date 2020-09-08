import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { EclRulesCatalogueComponent } from './ecl-rules-catalogue.component';

describe('EclRulesCatalogueComponent', () => {
  let component: EclRulesCatalogueComponent;
  let fixture: ComponentFixture<EclRulesCatalogueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EclRulesCatalogueComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EclRulesCatalogueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
