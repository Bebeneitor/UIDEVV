import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { InputSwitchModule } from "primeng/inputswitch";
import { DnBSharedModule } from "../../shared/shared.module";
import { CompareVersionsComponent } from "./compare-versions.component";

@NgModule({
  declarations: [CompareVersionsComponent],
  imports: [
    CommonModule,
    DnBSharedModule,
    RouterModule,
    FormsModule,
    InputSwitchModule,
  ],
})
export class CompareVersionsModule {}
