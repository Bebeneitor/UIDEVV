import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { UtilsService } from 'src/app/services/utils.service';
import { ReturnDialogComponent } from './return-dialog.component';
import { KeyLimitService } from '../../../../../shared/services/utils';


@NgModule({
    declarations: [ReturnDialogComponent],
    imports: [
        CommonModule,
        DropdownModule,
        FormsModule,
        DynamicDialogModule,
        InputTextareaModule
    ],
    providers: [
        UtilsService,
        KeyLimitService
    ]
})

export class ReturnDialogModule {

}
