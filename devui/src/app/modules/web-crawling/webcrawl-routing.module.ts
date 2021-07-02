import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { HomepageComponent } from "./pages/drug-search/drug-search.component";
import { DruglistComponent } from "./pages/drug-list/drug-list.component";
import { AddDrugComponent } from "./pages/add-drug/add-drug.component";
import { AuditComponent } from "./pages/audit-log/audit.component";

const routes: Routes = [
  {
    path: "",
    data: {
      breadcrumb: "Web Crawling",
      mainPage: true,
    },
    component: HomepageComponent,
  },
  {
    path: "drug-search",
    data: {
      breadcrumb: "Web Crawling",
      mainPage: true,
    },
    component: HomepageComponent,
  },
  {
    path: "drug-search/:drug",
    data: {
      breadcrumb: "Web Crawling",
      mainPage: true,
    },
    component: HomepageComponent,
  },
  {
    path: "list-all-drugs",
    data: {
      breadcrumb: "Drug List",
    },
    component: DruglistComponent,
  },
  {
    path: "add-new-drug",
    data: {
      breadcrumb: "Add New Drug",
    },
    component: AddDrugComponent,
  },
  {
    path: "update-drug",
    data: {
      breadcrumb: "Update Drug",
    },
    component: AddDrugComponent,
  },
  {
    path: "add-new-biosimilar",
    component: AddDrugComponent,
    data: {
      breadcrumb: "Add New Biosimilar",
    },
  },
  {
    path: "user-audit-logs",
    data: {
      breadcrumb: "Audit Logs",
    },
    component: AuditComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WebCrawlRoutingModule {}
