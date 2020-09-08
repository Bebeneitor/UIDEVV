import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DialogService, MessageService, ConfirmationService } from "primeng/api";
import { DropdownModule } from 'primeng/dropdown';
import { MessageModule } from "primeng/message";
import { ToastModule } from "primeng/toast";
import { TooltipModule } from 'primeng/tooltip';
import { RadioButtonModule } from 'primeng/radiobutton';
import { SavingsForRulesComponent } from './savings-for-rules.component';
import { SavingsForRulesRoutingModule} from './savings-for-rules.routing';
import { ListboxModule } from 'primeng/listbox';
import { ConfirmDialogModule} from 'primeng/confirmdialog';
import { sqlDateConversion } from 'src/app/shared/services/utils';
import { DialogModule } from 'primeng/dialog';
import { MultiSelectModule } from 'primeng/multiselect';
import { FieldsetModule, PickListModule, ProgressBarModule, CalendarModule } from 'primeng/primeng';

@NgModule({
  declarations: [SavingsForRulesComponent],
  imports: [
    CommonModule,
    FormsModule,
    DropdownModule,
    MessageModule,
    ToastModule,
    TooltipModule,
    RadioButtonModule,
    ListboxModule,
    ConfirmDialogModule,
    SavingsForRulesRoutingModule,
    DialogModule,
    MultiSelectModule,
    FieldsetModule,
    PickListModule,
    ProgressBarModule,
    CalendarModule
  ],
  providers:[
    sqlDateConversion,
    DialogService,
    MessageService,
    ConfirmationService
  ],
  entryComponents: [
  ]
})

export class SavingsForRulesModule { }