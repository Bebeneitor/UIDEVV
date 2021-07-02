import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateFilterTagComponent } from './update-filter-tag.component';

describe('UpdateFilterTagComponent', () => {
  let component: UpdateFilterTagComponent;
  let fixture: ComponentFixture<UpdateFilterTagComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateFilterTagComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateFilterTagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
