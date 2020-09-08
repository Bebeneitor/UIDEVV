import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmailNotificationComponent } from './email-notification.component';
import { EmailNotificationRoutingModule } from './email.notification.routing';
import {ChipsModule} from 'primeng/chips';
import {CheckboxModule} from 'primeng/checkbox';
import { EmailNotificationService } from 'src/app/services/email-notification.service';

@NgModule({
    declarations: [EmailNotificationComponent],
    imports: [
        CommonModule,
        FormsModule,
        EmailNotificationRoutingModule,
        ChipsModule,
        CheckboxModule
    ],
    providers : [
        EmailNotificationService
    ]
})

export class EmailNotificationModule {

}