import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { InputSwitchModule } from "primeng/inputswitch";
import { DnBSharedModule } from "../../shared/shared.module";
import { ApprovedVersionComponent } from './approved-version.component';
@NgModule({
  declarations: [ApprovedVersionComponent],
  imports: [
    CommonModule,
    DnBSharedModule,
    RouterModule,
    FormsModule,
    InputSwitchModule,
  ],
})
export class ApprovedVersionModule {}
