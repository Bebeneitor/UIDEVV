import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NirReferenceDetailComponent } from './nir-reference-detail.component';

describe('NirReferenceDetailComponent', () => {
  let component: NirReferenceDetailComponent;
  let fixture: ComponentFixture<NirReferenceDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NirReferenceDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NirReferenceDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
