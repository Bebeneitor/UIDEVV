import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectCategoriesComponent } from './project-categories.component';

describe('ProjectCategoriesComponent', () => {
  let component: ProjectCategoriesComponent;
  let fixture: ComponentFixture<ProjectCategoriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectCategoriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
