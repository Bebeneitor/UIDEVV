import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { JobCreationComponent } from './job-creation.component';
import { JobCreationRoutingModule } from './job-creation.routing';
import { TableModule } from 'primeng/table';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule } from '@angular/forms';
import { RadioButtonModule } from 'primeng/radiobutton';
import { MessageModule, MessageService, DropdownModule, DialogModule, DialogService } from 'primeng/primeng';
import { ToastModule } from 'primeng/toast';
import { JobSchedulerComponent } from '../job-scheduler/job-scheduler.component';

@NgModule({
  declarations: [JobCreationComponent, JobSchedulerComponent],
  imports: [
    CommonModule,
    JobCreationRoutingModule,
    FormsModule,
    TableModule,
    RadioButtonModule,
    CalendarModule,
    MessageModule,
    ToastModule,
    DropdownModule,
    DialogModule
  ],
  providers: [
    MessageService,
    DialogService
  ],
})

export class JobCreationModule { }