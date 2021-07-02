import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PdgRefAttachmentsComponent } from './pdg-ref-attachments.component';

describe('PdgRefAttachmentsComponent', () => {
  let component: PdgRefAttachmentsComponent;
  let fixture: ComponentFixture<PdgRefAttachmentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PdgRefAttachmentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PdgRefAttachmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
