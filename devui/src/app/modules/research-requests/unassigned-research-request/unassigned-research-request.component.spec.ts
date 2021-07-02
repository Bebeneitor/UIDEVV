import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnassignedResearchRequestComponent } from './unassigned-research-request.component';

describe('UnassignedResearchRequestComponent', () => {
  let component: UnassignedResearchRequestComponent;
  let fixture: ComponentFixture<UnassignedResearchRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnassignedResearchRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnassignedResearchRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
