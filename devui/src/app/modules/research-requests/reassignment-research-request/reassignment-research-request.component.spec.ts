import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReassignmentResearchRequestComponent } from './reassignment-research-request.component';

describe('ReassignmentResearchRequestComponent', () => {
  let component: ReassignmentResearchRequestComponent;
  let fixture: ComponentFixture<ReassignmentResearchRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReassignmentResearchRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReassignmentResearchRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});