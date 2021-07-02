import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferenceTitleComponent } from './reference-title.component';

describe('ReferenceTitleComponent', () => {
  let component: ReferenceTitleComponent;
  let fixture: ComponentFixture<ReferenceTitleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReferenceTitleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferenceTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
