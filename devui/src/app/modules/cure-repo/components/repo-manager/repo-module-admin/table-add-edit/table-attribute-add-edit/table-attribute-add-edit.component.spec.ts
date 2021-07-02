import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableAttributeAddEditComponent } from './table-attribute-add-edit.component';

describe('TableAttributeAddEditComponent', () => {
  let component: TableAttributeAddEditComponent;
  let fixture: ComponentFixture<TableAttributeAddEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableAttributeAddEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableAttributeAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
