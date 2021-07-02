import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResearchRequestLoginComponent } from './research-request-login.component';

describe('ResearchRequestLoginComponent', () => {
  let component: ResearchRequestLoginComponent;
  let fixture: ComponentFixture<ResearchRequestLoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResearchRequestLoginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResearchRequestLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
