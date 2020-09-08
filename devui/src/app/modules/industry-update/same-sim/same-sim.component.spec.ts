import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SameSimComponent } from './same-sim.component';

describe('SameSimComponent', () => {
  let component: SameSimComponent;
  let fixture: ComponentFixture<SameSimComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SameSimComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SameSimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
