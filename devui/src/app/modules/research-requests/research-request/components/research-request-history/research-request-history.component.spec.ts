import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResearchRequestHistoryComponent } from './research-request-history.component';

describe('ResearchRequestHistoryComponent', () => {
  let component: ResearchRequestHistoryComponent;
  let fixture: ComponentFixture<ResearchRequestHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResearchRequestHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResearchRequestHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
