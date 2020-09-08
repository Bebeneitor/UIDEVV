import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeTypesComponent } from './change-types.component';

describe('ChangeTypesComponent', () => {
  let component: ChangeTypesComponent;
  let fixture: ComponentFixture<ChangeTypesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeTypesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
