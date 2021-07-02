import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { MultiSelectModule } from 'primeng/multiselect';
import { BlockUIModule, CalendarModule, DropdownModule } from 'primeng/primeng';
import { RadioButtonModule } from 'primeng/radiobutton';
import { SidebarModule } from 'primeng/sidebar';
import { StepsModule } from 'primeng/steps';
import { TabViewModule } from 'primeng/tabview';
import { ToastModule } from 'primeng/toast';
import { SharedModule } from 'src/app/shared/shared.module';
import { CpeTemplateComponent } from './cpe-template.component';
import { CpeTemplateRoutingModule } from './cpe-template.routing';

import { TooltipModule } from 'primeng/tooltip';

@NgModule({
    declarations: [CpeTemplateComponent],
    imports: [
        CommonModule,
        FormsModule,
        CpeTemplateRoutingModule,
        CalendarModule,
        RadioButtonModule,
        DropdownModule,
        CheckboxModule,
        SidebarModule,
        BlockUIModule,
        TabViewModule,
        MultiSelectModule,
        StepsModule,
        ToastModule,
        CardModule,
        SharedModule,
        TooltipModule
    ]
})
export class CpeTemplateModule { }