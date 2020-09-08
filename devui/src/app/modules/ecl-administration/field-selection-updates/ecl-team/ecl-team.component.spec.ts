import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EclTeamComponent } from './ecl-team.component';

describe('EclTeamComponent', () => {
  let component: EclTeamComponent;
  let fixture: ComponentFixture<EclTeamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EclTeamComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EclTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
