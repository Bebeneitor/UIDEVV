import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { JobSchedulerComponent } from './job-scheduler.component';
import { JobSchedulerRoutingModule } from './job-scheduler.routing';
import { TableModule } from 'primeng/table';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule } from '@angular/forms';
import { RadioButtonModule } from 'primeng/radiobutton';
import { MessageModule, MessageService, DropdownModule, DialogModule, TabViewModule, CheckboxModule, DialogService } from 'primeng/primeng';
import { ToastModule } from 'primeng/toast';

@NgModule({
    declarations: [JobSchedulerComponent],
    imports: [
      CommonModule,
      JobSchedulerRoutingModule,
      FormsModule,
      TableModule,
      RadioButtonModule,
      CalendarModule,
      MessageModule,
      ToastModule,
      DropdownModule,
      DialogModule,
      TabViewModule,
      CheckboxModule
    ],
    providers: [
      MessageService,
      DialogService
    ]
  })

  export class JobSchedulerModule { }