import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SameSimListComponent } from './same-sim-list.component';

describe('SameSimListComponent', () => {
  let component: SameSimListComponent;
  let fixture: ComponentFixture<SameSimListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SameSimListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SameSimListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
