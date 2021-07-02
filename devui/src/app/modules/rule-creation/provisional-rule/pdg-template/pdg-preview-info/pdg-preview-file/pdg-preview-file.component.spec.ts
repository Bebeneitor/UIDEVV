import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PdgPreviewFileComponent } from './pdg-preview-file.component';

describe('PdgPreviewFileComponent', () => {
  let component: PdgPreviewFileComponent;
  let fixture: ComponentFixture<PdgPreviewFileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PdgPreviewFileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PdgPreviewFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
