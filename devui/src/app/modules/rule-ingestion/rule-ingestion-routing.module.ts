import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IngestedRulesComponent } from './components/ingested-rules/ingested-rules.component';
import { IngestionProcessComponent } from './components/ingestion-process/ingestion-process.component';

const routes: Routes = [
  { path: 'ingestion-process', component: IngestionProcessComponent },
  { path: 'ingested-rules', component: IngestedRulesComponent, data: { pageTitle: 'List of ingested rules' } },
  { path: 'cvp-template', loadChildren: () => import('./components/cvp-template/cvp-template.module').then(m => m.CvpTempalteModule) },
  { path: 'cvp-template/:cvpIngestionId', loadChildren: () => import('./components/cvp-template/cvp-template.module').then(m => m.CvpTempalteModule) },
  { path: 'cpe-template', loadChildren: () => import('./components/cpe-template/cpe-template.module').then(m => m.CpeTemplateModule) },
  { path: 'cpe-template/:cpeIngestionId', loadChildren: () => import('./components/cpe-template/cpe-template.module').then(m => m.CpeTemplateModule) },
  { path: '**', redirectTo: 'ingested-rules' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RuleIngestionRoutingModule { }
