import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NirSearchFormComponent } from './nir-search-form.component';


describe('NirReferenceDetailComponent', () => {
  let component: NirSearchFormComponent;
  let fixture: ComponentFixture<NirSearchFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NirSearchFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NirSearchFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
