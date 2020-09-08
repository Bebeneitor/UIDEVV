import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IngestionProcessComponent } from './components/ingestion-process/ingestion-process.component';
import { IngestedRulesComponent } from './components/ingested-rules/ingested-rules.component';
import { CvpTemplateComponent } from './components/cvp-template/cvp-template.component';

const routes: Routes = [
  { path: 'ingestion-process', component: IngestionProcessComponent },
  { path: 'ingested-rules', component: IngestedRulesComponent, data: { pageTitle: 'List of ingested rules' } },
  { path: 'cvp-template', loadChildren: () => import('./components/cvp-template/cvp-template.module').then(m => m.CvpTempalteModule) },
  { path: 'cvp-template/:cvpIngestionId', loadChildren: () => import('./components/cvp-template/cvp-template.module').then(m => m.CvpTempalteModule) },
  { path: '**', redirectTo: 'ingested-rules' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RuleIngestionRoutingModule { }
