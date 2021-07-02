import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IcdCopyPasteComponent } from './icd-copy-paste.component';

describe('IcdCopyPasteComponent', () => {
  let component: IcdCopyPasteComponent;
  let fixture: ComponentFixture<IcdCopyPasteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IcdCopyPasteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IcdCopyPasteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
