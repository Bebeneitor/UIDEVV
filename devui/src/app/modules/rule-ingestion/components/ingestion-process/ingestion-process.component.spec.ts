import { HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ConfirmationService, ConfirmDialogModule, DropdownModule, FileUploadModule, MessageService, OverlayPanelModule, StepsModule } from 'primeng/primeng';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { SharedModule } from 'src/app/shared/shared.module';
import { RuleIngestionRoutingModule } from '../../rule-ingestion-routing.module';
import { IngestionProcessComponent } from './ingestion-process.component';


describe('IngestionProcessComponent', () => {
  let component: IngestionProcessComponent;
  let fixture: ComponentFixture<IngestionProcessComponent>;
  let location: Location;
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [IngestionProcessComponent],
      imports: [
        FileUploadModule,
        ToastModule,
        TableModule,
        FormsModule,
        ConfirmDialogModule,
        DropdownModule,
        StepsModule,
        OverlayPanelModule,
        HttpClientModule,
        SharedModule,
        RouterTestingModule,
        DropdownModule,
        RuleIngestionRoutingModule
      ],
      providers: [ConfirmationService, MessageService
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IngestionProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the RuleIngestionComponent', () => {
    expect(component).toBeTruthy();
  });

});
