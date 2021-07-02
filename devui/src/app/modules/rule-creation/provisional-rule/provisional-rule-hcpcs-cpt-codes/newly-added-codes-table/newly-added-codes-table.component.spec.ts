import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewlyAddedCodesTableComponent } from './newly-added-codes-table.component';

describe('NewlyAddedCodesTableComponent', () => {
  let component: NewlyAddedCodesTableComponent;
  let fixture: ComponentFixture<NewlyAddedCodesTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewlyAddedCodesTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewlyAddedCodesTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
