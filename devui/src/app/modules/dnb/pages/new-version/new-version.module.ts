import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { NgxPermissionsModule } from "ngx-permissions";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { InputSwitchModule } from "primeng/inputswitch";
import { ListboxModule } from "primeng/listbox";
import { OverlayPanelModule } from "primeng/overlaypanel";
import { CheckboxModule } from "primeng/primeng";
import { ChooseOptionDialogComponentModule } from "src/app/shared/components/choose-option-dialog/choose-option-dialog.module";
import { DnBSharedModule } from "../../shared/shared.module";
import { DnBDirectivesModule } from "../../utils/directives/dnb-directives.module";
import { NewVersionComponent } from "./new-version.component";

@NgModule({
  declarations: [NewVersionComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DnBSharedModule,
    RouterModule,
    InputSwitchModule,
    ConfirmDialogModule,
    OverlayPanelModule,
    ListboxModule,
    ChooseOptionDialogComponentModule,
    DnBDirectivesModule,
    CheckboxModule,
    NgxPermissionsModule,
  ],
  providers: [DnBDirectivesModule],
})
export class NewVersionModule {}
