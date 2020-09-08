import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignIdeaComponent } from './assign-idea.component';

describe('AssignIdeaComponent', () => {
  let component: AssignIdeaComponent;
  let fixture: ComponentFixture<AssignIdeaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignIdeaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignIdeaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
