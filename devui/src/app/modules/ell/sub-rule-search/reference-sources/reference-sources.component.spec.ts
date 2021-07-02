import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferenceSourcesComponent } from './reference-sources.component';

describe('ReferenceSourcesComponent', () => {
  let component: ReferenceSourcesComponent;
  let fixture: ComponentFixture<ReferenceSourcesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReferenceSourcesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferenceSourcesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
