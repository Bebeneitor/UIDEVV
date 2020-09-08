import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndustryUpdateCrosswalkComponent } from './industry-update-crosswalk.component';

describe('IndustryUpdateCrosswalkComponent', () => {
  let component: IndustryUpdateCrosswalkComponent;
  let fixture: ComponentFixture<IndustryUpdateCrosswalkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndustryUpdateCrosswalkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndustryUpdateCrosswalkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
