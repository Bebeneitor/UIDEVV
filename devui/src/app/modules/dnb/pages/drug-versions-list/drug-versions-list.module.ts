import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { CheckboxModule } from "primeng/checkbox";
import { EclTableModule } from "src/app/shared/components/ecl-table/ecl-table.module";
import { DnBSharedModule } from "../../shared/shared.module";
import { DrugVersionsListComponent } from "./drug-versions-list.component";
import { RuleManagerService } from "../../../industry-update/rule-process/services/rule-manager.service";
import { DialogService } from "primeng/api";
import { ProvisionalRuleComponent } from "src/app/modules/rule-creation/provisional-rule/provisional-rule.component";
import { ProvisionalRuleModule } from "../../../rule-creation/provisional-rule/provisional-rule.module";
import { PipesModule } from "../../utils/pipes/pipes.module";
import { ChooseOptionDialogComponentModule } from "src/app/shared/components/choose-option-dialog/choose-option-dialog.module";

@NgModule({
  declarations: [DrugVersionsListComponent],
  imports: [
    CommonModule,
    FormsModule,
    DnBSharedModule,
    EclTableModule,
    RouterModule,
    CheckboxModule,
    ProvisionalRuleModule,
    PipesModule,
    ChooseOptionDialogComponentModule,
  ],
  providers: [RuleManagerService, DialogService],
  entryComponents: [ProvisionalRuleComponent],
})
export class DrugVersionsListModule {}
