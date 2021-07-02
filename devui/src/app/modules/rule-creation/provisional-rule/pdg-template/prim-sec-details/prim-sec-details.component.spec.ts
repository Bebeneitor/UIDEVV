import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrimSecDetailsComponent } from './prim-sec-details.component';

describe('PrimSecDetailsComponent', () => {
  let component: PrimSecDetailsComponent;
  let fixture: ComponentFixture<PrimSecDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrimSecDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrimSecDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
