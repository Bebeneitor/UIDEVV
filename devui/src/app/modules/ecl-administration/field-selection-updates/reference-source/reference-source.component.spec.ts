import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferenceSourceComponent } from './reference-source.component';

describe('ReferenceSourceComponent', () => {
  let component: ReferenceSourceComponent;
  let fixture: ComponentFixture<ReferenceSourceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReferenceSourceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferenceSourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
