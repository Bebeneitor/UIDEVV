import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResearchRequestCommentsComponent } from './research-request-comments.component';

describe('ResearchRequestCommentsComponent', () => {
  let component: ResearchRequestCommentsComponent;
  let fixture: ComponentFixture<ResearchRequestCommentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResearchRequestCommentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResearchRequestCommentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
