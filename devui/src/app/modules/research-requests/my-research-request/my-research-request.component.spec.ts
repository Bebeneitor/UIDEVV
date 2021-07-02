import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyResearchRequestComponent } from './my-research-request.component';

describe('MyResearchRequestComponent', () => {
  let component: MyResearchRequestComponent;
  let fixture: ComponentFixture<MyResearchRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyResearchRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyResearchRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
