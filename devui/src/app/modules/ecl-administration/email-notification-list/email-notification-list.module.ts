import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmailNotificationListComponent } from './email-notification-list.component';
import { EmailNotificationListRoutingModule } from './email-notification-list.routing';
import { TableModule } from 'primeng/table';
import { EmailNotificationService } from 'src/app/services/email-notification.service';
import {TooltipModule} from 'primeng/tooltip';
import { EclTableModule } from 'src/app/shared/components/ecl-table/ecl-table.module';

@NgModule({
    declarations: [EmailNotificationListComponent],
    imports: [
        CommonModule,
        FormsModule,
        EmailNotificationListRoutingModule,
        TableModule,
        TooltipModule,
        EclTableModule
    ],
    providers : [
        EmailNotificationService
    ]
})

export class EmailNotificationListModule {

}