import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PdgFileAttachmentsComponent } from './pdg-file-attachments.component';

describe('PdgFileAttachmentsComponent', () => {
  let component: PdgFileAttachmentsComponent;
  let fixture: ComponentFixture<PdgFileAttachmentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PdgFileAttachmentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PdgFileAttachmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
