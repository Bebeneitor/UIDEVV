import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeOfChangeMarkerComponent } from './type-of-change-marker.component';

describe('TypeOfChangeComponent', () => {
  let component: TypeOfChangeMarkerComponent;
  let fixture: ComponentFixture<TypeOfChangeMarkerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TypeOfChangeMarkerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TypeOfChangeMarkerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
