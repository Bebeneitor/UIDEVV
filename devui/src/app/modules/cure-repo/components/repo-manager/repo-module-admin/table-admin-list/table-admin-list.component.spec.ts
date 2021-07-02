import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableAdminListComponent } from './table-admin-list.component';

describe('TableAdminListComponent', () => {
  let component: TableAdminListComponent;
  let fixture: ComponentFixture<TableAdminListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableAdminListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableAdminListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
