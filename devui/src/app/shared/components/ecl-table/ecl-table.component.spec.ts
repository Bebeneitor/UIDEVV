import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EclTableComponent } from './ecl-table.component';

describe('EclTableComponent', () => {
  let component: EclTableComponent;
  let fixture: ComponentFixture<EclTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EclTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EclTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
