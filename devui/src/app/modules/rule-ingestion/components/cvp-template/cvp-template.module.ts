import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CalendarModule, DropdownModule, BlockUIModule } from 'primeng/primeng';
import {RadioButtonModule} from 'primeng/radiobutton';
import {CheckboxModule} from 'primeng/checkbox';
import {SidebarModule} from 'primeng/sidebar';
import { CvpTemplateComponent } from './cvp-template.component';
import { CvpTemplateRoutingModule } from './cvp-template.routing';
import { FileUploaderComponent } from './components/file-uploader/file-uploader.component';
import {MultiSelectModule} from 'primeng/multiselect';

@NgModule({
    declarations: [CvpTemplateComponent, FileUploaderComponent],
    imports: [
        CommonModule,
        FormsModule,
        CvpTemplateRoutingModule,
        CalendarModule,
        RadioButtonModule,
        DropdownModule,
        CheckboxModule,
        SidebarModule,
        BlockUIModule,
        MultiSelectModule
    ]
})
export class CvpTempalteModule { }
