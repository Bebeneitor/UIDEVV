import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { EclTableModule } from "src/app/shared/components/ecl-table/ecl-table.module";
import { DnBSharedModule } from "../../shared/shared.module";
import { SelectDrugComponent } from "./select-drug.component";
import { ChooseOptionDialogComponentModule } from "src/app/shared/components/choose-option-dialog/choose-option-dialog.module";
import { NgxPermissionsModule } from "ngx-permissions";

@NgModule({
  declarations: [SelectDrugComponent],
  imports: [
    CommonModule,
    FormsModule,
    DnBSharedModule,
    EclTableModule,
    ChooseOptionDialogComponentModule,
    NgxPermissionsModule,
  ],
})
export class SelectDrugModule {}
