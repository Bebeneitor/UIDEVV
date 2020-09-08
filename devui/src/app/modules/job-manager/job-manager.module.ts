import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { JobManagerComponent } from './job-manager.component';
import { JobManagerRoutingModule } from './job-manager.routing';
import { TableModule } from 'primeng/table';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule } from '@angular/forms';
import { RadioButtonModule } from 'primeng/radiobutton';
import { MessageModule, MessageService, DialogService, DialogModule, DropdownModule } from 'primeng/primeng';
import { ToastModule } from 'primeng/toast';
import { JobCreationComponent } from './job-creation/job-creation.component';
import { JobSchedulerComponent } from './job-scheduler/job-scheduler.component';
import { JobSchedulerModule } from './job-scheduler/job-scheduler.module';

@NgModule({
  declarations: [JobManagerComponent, JobCreationComponent],
  imports: [
    CommonModule,
    JobManagerRoutingModule,
    FormsModule,
    TableModule,
    RadioButtonModule,
    CalendarModule,
    MessageModule,
    ToastModule,
    DialogModule,
    DropdownModule,
    JobSchedulerModule
  ],
  providers: [
    MessageService,
    DialogService
  ],
  entryComponents: [JobSchedulerComponent]
})

export class JobManagerModule { }