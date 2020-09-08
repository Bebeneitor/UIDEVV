import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NewIdeaResearchDuplicateCheckComponent } from './nir-duplicate-chk.component';


describe('NirReferenceDetailComponent', () => {
  let component: NewIdeaResearchDuplicateCheckComponent;
  let fixture: ComponentFixture<NewIdeaResearchDuplicateCheckComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewIdeaResearchDuplicateCheckComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewIdeaResearchDuplicateCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
