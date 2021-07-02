import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ApprovedVersionComponent } from "./pages/approved-version/approved-version.component";
import { CompareVersionsComponent } from "./pages/compare-versions/compare-versions.component";
import { DrugVersionsListComponent } from "./pages/drug-versions-list/drug-versions-list.component";
import { DrugsInApprovalProcessComponent } from "./pages/drugs-in-approval-process/drugs-in-approval-process.component";
import { NewDrugComponent } from "./pages/new-drug/new-drug.component";
import { NewVersionComponent } from "./pages/new-version/new-version.component";
import { SelectDrugComponent } from "./pages/select-drug/select-drug.component";
import { ConfirmDeactivateGuard } from "./utils/guards/confirm-deactivate.guard";
import { DnbRolesGuard } from "./utils/guards/dnb-roles.guard";
import { MidRuleAdminComponent } from "./pages/mid-rule-admin/mid-rule-admin.component";
import { TemplateFlagsComponent } from "./pages/template-flags/template-flags.component";
import { PinnedSectionsComponent } from "./pages/pinned-sections/pinned-sections.component";
const routes: Routes = [
  {
    canActivate: [DnbRolesGuard],
    path: "select-drug",
    data: {
      breadcrumb: "Drug Library",
      mainPage: true,
    },
    component: SelectDrugComponent,
  },
  {
    canActivate: [DnbRolesGuard],
    path: "drug-versions",
    data: {
      breadcrumb: "Drug Versions",
    },
    component: DrugVersionsListComponent,
  },
  {
    canActivate: [DnbRolesGuard],
    path: "new-version",
    data: {
      breadcrumb: "New Version",
    },
    component: NewVersionComponent,
    canDeactivate: [ConfirmDeactivateGuard],
  },
  {
    path: "compare-versions",
    data: {
      breadcrumb: "Compare Versions",
    },
    component: CompareVersionsComponent,
  },
  {
    path: "drugs-in-approval-process",
    data: {
      breadcrumb: "Drug In Approval Process",
      mainPage: true,
    },
    component: DrugsInApprovalProcessComponent,
  },
  {
    path: "approved-version",
    data: {
      breadcrumb: "Approved Version",
    },
    component: ApprovedVersionComponent,
  },
  {
    path: "new-drug",
    data: {
      breadcrumb: "New Drug",
    },
    component: NewDrugComponent,
    canDeactivate: [ConfirmDeactivateGuard],
  },
  {
    path: "mid-rule-admin",
    data: {
      breadcrumb: "Mid Rules Template Configuration",
      mainPage: true,
    },
    component: MidRuleAdminComponent,
  },
  {
    path: "template-flags",
    component: TemplateFlagsComponent,
  },
  {
    path: "pinned-sections",
    component: PinnedSectionsComponent,
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DnBRoutingModule {}
