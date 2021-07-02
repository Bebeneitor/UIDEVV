import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PdgTemplateComponent } from './pdg-template.component';

describe('PdgTemplateComponent', () => {
  let component: PdgTemplateComponent;
  let fixture: ComponentFixture<PdgTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PdgTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PdgTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
