import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { EclTableModule } from "src/app/shared/components/ecl-table/ecl-table.module";
import { DnBSharedModule } from "../../shared/shared.module";
import { MidRuleAdminComponent } from "./mid-rule-admin.component";
@NgModule({
  declarations: [MidRuleAdminComponent],
  imports: [
    CommonModule,
    DnBSharedModule,
    ConfirmDialogModule,
    FormsModule,
    ReactiveFormsModule,
    EclTableModule,
  ],
  providers: [],
})
export class MidRuleAdminModule {}
