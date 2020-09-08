import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { EclTableModule } from "src/app/shared/components/ecl-table/ecl-table.module";
import { DnBSharedModule } from "../../shared/shared.module";
import { SelectDrugComponent } from "./select-drug.component";

@NgModule({
  declarations: [SelectDrugComponent],
  imports: [CommonModule, FormsModule, DnBSharedModule, EclTableModule],
})
export class SelectDrugModule {}
