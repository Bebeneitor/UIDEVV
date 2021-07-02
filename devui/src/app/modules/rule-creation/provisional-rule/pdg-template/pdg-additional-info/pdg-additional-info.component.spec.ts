import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PdgAdditionalInfoComponent } from './pdg-additional-info.component';

describe('PdgAdditionalInfoComponent', () => {
  let component: PdgAdditionalInfoComponent;
  let fixture: ComponentFixture<PdgAdditionalInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PdgAdditionalInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PdgAdditionalInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
