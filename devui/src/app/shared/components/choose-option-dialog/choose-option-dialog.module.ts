
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChooseOptionDialogComponent } from './choose-option-dialog.component';
import { DialogModule } from "primeng/dialog";
import { RadioButtonModule } from "primeng/primeng";

@NgModule({
  declarations: [ChooseOptionDialogComponent],
  exports: [ChooseOptionDialogComponent],
  imports: [
    FormsModule,
    CommonModule,
    DialogModule,
    RadioButtonModule
  ],
 providers:[ChooseOptionDialogComponent]
})
export class ChooseOptionDialogComponentModule { }