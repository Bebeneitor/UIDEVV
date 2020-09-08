import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LibraryRuleComponent } from './library-rule.component';

describe('LibraryRuleComponent', () => {
  let component: LibraryRuleComponent;
  let fixture: ComponentFixture<LibraryRuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LibraryRuleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LibraryRuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
