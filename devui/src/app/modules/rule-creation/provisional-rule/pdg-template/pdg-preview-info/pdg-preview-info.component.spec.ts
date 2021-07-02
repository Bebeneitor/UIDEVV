import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PdgPreviewInfoComponent } from './pdg-preview-info.component';

describe('PdgPreviewInfoComponent', () => {
  let component: PdgPreviewInfoComponent;
  let fixture: ComponentFixture<PdgPreviewInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PdgPreviewInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PdgPreviewInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
