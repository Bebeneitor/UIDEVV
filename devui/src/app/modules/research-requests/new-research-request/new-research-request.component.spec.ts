import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewResearchRequestComponent } from './new-research-request.component';

describe('NewResearchRequestComponent', () => {
  let component: NewResearchRequestComponent;
  let fixture: ComponentFixture<NewResearchRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewResearchRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewResearchRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
