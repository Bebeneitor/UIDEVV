import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignmentNewIdeaComponent } from './assignment-new-idea.component';

describe('AssignmentNewIdeaComponent', () => {
  let component: AssignmentNewIdeaComponent;
  let fixture: ComponentFixture<AssignmentNewIdeaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignmentNewIdeaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignmentNewIdeaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
