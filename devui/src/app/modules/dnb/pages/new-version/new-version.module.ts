import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { InputSwitchModule } from "primeng/inputswitch";
import { ListboxModule } from "primeng/listbox";
import { OverlayPanelModule } from "primeng/overlaypanel";
import { DnBSharedModule } from "../../shared/shared.module";
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
  ],
})
export class NewVersionModule {}
