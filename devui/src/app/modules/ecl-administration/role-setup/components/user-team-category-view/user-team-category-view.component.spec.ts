import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserTeamCategoryViewComponent } from './user-team-category-view.component';

describe('UserTeamCategoryViewComponent', () => {
  let component: UserTeamCategoryViewComponent;
  let fixture: ComponentFixture<UserTeamCategoryViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserTeamCategoryViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserTeamCategoryViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
