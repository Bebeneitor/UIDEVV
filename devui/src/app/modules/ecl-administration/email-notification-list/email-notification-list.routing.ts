import { NgModule} from "@angular/core";
import { Routes, RouterModule } from '@angular/router';
import { EmailNotificationListComponent } from './email-notification-list.component';

const routes: Routes = [
    {
        path: '',
        component: EmailNotificationListComponent        
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class EmailNotificationListRoutingModule {
 
}