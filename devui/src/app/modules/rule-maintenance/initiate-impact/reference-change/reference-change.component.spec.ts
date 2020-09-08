import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferenceChangeComponent } from './reference-change.component';

describe('ReferenceChangeComponent', () => {
  let component: ReferenceChangeComponent;
  let fixture: ComponentFixture<ReferenceChangeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReferenceChangeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferenceChangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
