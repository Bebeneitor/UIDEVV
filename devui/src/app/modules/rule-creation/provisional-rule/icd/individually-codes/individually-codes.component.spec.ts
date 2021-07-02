import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndividuallyCodesComponent } from './individually-codes.component';

describe('IndividuallyCodesComponent', () => {
  let component: IndividuallyCodesComponent;
  let fixture: ComponentFixture<IndividuallyCodesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndividuallyCodesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndividuallyCodesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
