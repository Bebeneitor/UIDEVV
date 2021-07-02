import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResearchRequestComponent } from './research-request.component';

describe('ResearchRequestComponent', () => {
  let component: ResearchRequestComponent;
  let fixture: ComponentFixture<ResearchRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResearchRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResearchRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
