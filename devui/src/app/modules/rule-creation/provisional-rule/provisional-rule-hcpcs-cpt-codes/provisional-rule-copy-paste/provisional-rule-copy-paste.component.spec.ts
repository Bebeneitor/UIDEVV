import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProvisionalRuleCopyPasteComponent } from './provisional-rule-copy-paste.component';

describe('ProvisionalRuleCopyPasteComponent', () => {
  let component: ProvisionalRuleCopyPasteComponent;
  let fixture: ComponentFixture<ProvisionalRuleCopyPasteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProvisionalRuleCopyPasteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProvisionalRuleCopyPasteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
