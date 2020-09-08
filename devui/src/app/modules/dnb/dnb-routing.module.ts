import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ApprovedVersionComponent } from "./pages/approved-version/approved-version.component";
import { CompareVersionsComponent } from "./pages/compare-versions/compare-versions.component";
import { DrugVersionsListComponent } from "./pages/drug-versions-list/drug-versions-list.component";
import { DrugsInApprovalProcessComponent } from "./pages/drugs-in-approval-process/drugs-in-approval-process.component";
import { NewVersionComponent } from "./pages/new-version/new-version.component";
import { SelectDrugComponent } from "./pages/select-drug/select-drug.component";
import { ConfirmDeactivateGuard } from "./utils/guards/confirm-deactivate.guard";

const routes: Routes = [
  {
    path: "select-drug",
    component: SelectDrugComponent,
  },
  {
    path: "drug-versions",
    component: DrugVersionsListComponent,
  },
  {
    path: "new-version",
    component: NewVersionComponent,
    canDeactivate: [ConfirmDeactivateGuard],
  },
  {
    path: "compare-versions",
    component: CompareVersionsComponent,
  },
  {
    path: "drugs-in-approval-process",
    component: DrugsInApprovalProcessComponent,
  },
  {
    path: "approved-version",
    component: ApprovedVersionComponent,
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DnBRoutingModule {}
