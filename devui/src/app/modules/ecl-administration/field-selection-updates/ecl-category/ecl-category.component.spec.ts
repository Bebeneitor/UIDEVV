import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EclCategoryComponent } from './ecl-category.component';

describe('EclCategoryComponent', () => {
  let component: EclCategoryComponent;
  let fixture: ComponentFixture<EclCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EclCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EclCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
