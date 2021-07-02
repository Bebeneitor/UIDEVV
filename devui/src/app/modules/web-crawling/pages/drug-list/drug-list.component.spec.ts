import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DruglistComponent } from './drug-list.component';

describe('DruglistComponent', () => {
  let component: DruglistComponent;
  let fixture: ComponentFixture<DruglistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DruglistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DruglistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
