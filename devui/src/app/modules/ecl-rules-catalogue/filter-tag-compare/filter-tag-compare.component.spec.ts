import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterTagCompareComponent } from './filter-tag-compare.component';

describe('FilterTagCompareComponent', () => {
  let component: FilterTagCompareComponent;
  let fixture: ComponentFixture<FilterTagCompareComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilterTagCompareComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterTagCompareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
