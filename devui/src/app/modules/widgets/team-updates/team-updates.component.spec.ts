import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamUpdatesComponent } from './team-updates.component';

describe('TeamUpdatesComponent', () => {
  let component: TeamUpdatesComponent;
  let fixture: ComponentFixture<TeamUpdatesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeamUpdatesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamUpdatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
