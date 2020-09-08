import { NgModule } from '@angular/core';
import { SetupNotificationComponent } from './setup-notification.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
    {
        path: '',
        component: SetupNotificationComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SetupNotificationRoutingModule { }