import { NgModule} from "@angular/core";
import { Routes, RouterModule } from '@angular/router';
import { EmailNotificationComponent } from './email-notification.component';

const routes: Routes = [
    {
        path: '',
        component: EmailNotificationComponent        
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class EmailNotificationRoutingModule {
 
}