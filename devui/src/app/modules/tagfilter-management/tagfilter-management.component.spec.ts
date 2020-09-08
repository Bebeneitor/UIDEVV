import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TagfilterManagementComponent } from './tagfilter-management.component';

describe('TagfilterManagementComponent', () => {
  let component: TagfilterManagementComponent;
  let fixture: ComponentFixture<TagfilterManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TagfilterManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TagfilterManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
