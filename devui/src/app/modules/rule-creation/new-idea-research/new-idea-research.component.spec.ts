import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NewIdeaResearchComponent } from './new-idea-research.component';


describe('NirReferenceDetailComponent', () => {
  let component: NewIdeaResearchComponent;
  let fixture: ComponentFixture<NewIdeaResearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewIdeaResearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewIdeaResearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
