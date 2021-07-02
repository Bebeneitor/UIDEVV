import { CommonModule } from '@angular/common';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { BlockUIModule } from 'primeng/primeng';
import { of } from 'rxjs';
import { ResearchRequestService } from 'src/app/services/research-request.service';
import { ResearchRequestDto } from 'src/app/shared/models/dto/research-request-dto';
import { ProjectRequestDto } from '../../models/dto/project-request-dto';
import { RRSharedModules } from '../../shared/shared.module';
import { ProjectRequestComponent } from './project-request.component';

describe('ProjectRequestComponent', () => {
  let component: ProjectRequestComponent;
  let fixture: ComponentFixture<ProjectRequestComponent>;
  let rrService: ResearchRequestService;
  const rrDto: ResearchRequestDto = new ResearchRequestDto;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ProjectRequestComponent
      ],
      providers: [
        ResearchRequestService
      ],
      imports: [
        CommonModule,
        FormsModule,
        RRSharedModules,
        BlockUIModule
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectRequestComponent);
    rrService = TestBed.get(ResearchRequestService);
    spyOn(rrService, "getResearchRequestDetails").and.returnValue(of([rrDto]));
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should convert request into project', () => {
    let newProject = component.stripExcessRRData(rrDto);
    expect(newProject.projectId).toBeFalsy();
    expect(newProject.clientSelected.length).toEqual(0);
    expect(newProject.selectedPayerList.length).toEqual(0);
  })
});
