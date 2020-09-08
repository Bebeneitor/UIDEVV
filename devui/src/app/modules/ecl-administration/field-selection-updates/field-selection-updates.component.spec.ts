import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldSelectionUpdatesComponent } from './field-selection-updates.component';

describe('FieldSelectionUpdatesComponent', () => {
  let component: FieldSelectionUpdatesComponent;
  let fixture: ComponentFixture<FieldSelectionUpdatesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FieldSelectionUpdatesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FieldSelectionUpdatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
