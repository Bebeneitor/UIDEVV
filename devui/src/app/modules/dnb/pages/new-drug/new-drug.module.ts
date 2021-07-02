import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { NgxPermissionsModule } from "ngx-permissions";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { InputSwitchModule } from "primeng/inputswitch";
import { CheckboxModule, OverlayPanelModule } from "primeng/primeng";
import { DnBSharedModule } from "../../shared/shared.module";
import { NewDrugComponent } from "./new-drug.component";

@NgModule({
  declarations: [NewDrugComponent],
  imports: [
    CommonModule,
    DnBSharedModule,
    RouterModule,
    FormsModule,
    InputSwitchModule,
    InputSwitchModule,
    ConfirmDialogModule,
    NgxPermissionsModule,
    CheckboxModule,
    OverlayPanelModule,
  ],
})
export class NewDrugModule {}
