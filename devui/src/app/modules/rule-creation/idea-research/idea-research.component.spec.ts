import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IdeaResearchComponent } from './idea-research.component';

describe('IdeaResearchComponent', () => {
  let component: IdeaResearchComponent;
  let fixture: ComponentFixture<IdeaResearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IdeaResearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IdeaResearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
