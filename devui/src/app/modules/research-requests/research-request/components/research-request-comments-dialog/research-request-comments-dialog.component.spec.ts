import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResearchRequestCommentsDialogComponent } from './research-request-comments-dialog.component';

describe('ResearchRequestCommentsDialogComponent', () => {
  let component: ResearchRequestCommentsDialogComponent;
  let fixture: ComponentFixture<ResearchRequestCommentsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResearchRequestCommentsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResearchRequestCommentsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
