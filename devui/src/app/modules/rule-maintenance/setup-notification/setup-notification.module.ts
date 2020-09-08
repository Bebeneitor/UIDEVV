import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SetupNotificationComponent } from './setup-notification.component';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/checkbox';
import { SetupNotificationRoutingModule } from './setup-notification.routing';
import { IdeaService } from '../../../services/idea.service';
import { StorageService } from '../../../services/storage.service';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { DialogModule } from "primeng/dialog";
import { MessageService } from 'primeng/api';
import { MessageModule } from 'primeng/primeng';
import { ToastModule } from 'primeng/toast';
import { CalendarModule } from 'primeng/calendar';
import { EclTableModule } from 'src/app/shared/components/ecl-table/ecl-table.module';

@NgModule({
  declarations: [SetupNotificationComponent],
  imports: [
    CommonModule,
    TableModule,
    DropdownModule,
    CheckboxModule,
    FormsModule,
    MessageModule,
    SetupNotificationRoutingModule,
    SharedModule,
    ToastModule,
    DialogModule,
    CalendarModule,
    EclTableModule
  ],
  providers: [
    IdeaService,
    MessageService,
    StorageService
  ],
})
export class SetupNotificationModule { }
