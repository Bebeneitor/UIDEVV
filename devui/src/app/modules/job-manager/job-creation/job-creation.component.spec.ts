import { TestBed, ComponentFixture, async } from '@angular/core/testing';
import { JobCreationComponent } from './job-creation.component';

describe('JobCreationComponent', () => {
    let component: JobCreationComponent;
    let fixture: ComponentFixture<JobCreationComponent>;
  
    beforeEach(async(() => {
      TestBed.configureTestingModule({
        declarations: [ JobCreationComponent ]
      })
      .compileComponents();
    }));
  
    beforeEach(() => {
      fixture = TestBed.createComponent(JobCreationComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
  
    it('should create', () => {
      expect(component).toBeTruthy();
    });
  });