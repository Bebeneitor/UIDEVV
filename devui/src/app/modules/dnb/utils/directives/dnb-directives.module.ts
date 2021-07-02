import { NgModule } from "@angular/core";
import { MaxLengthDirective } from "./dnb-maxlength.directive";
import { DnbRolesDirective } from "./dnb-roles.directive";
import { ResizableDirective } from "./resize.directive";
@NgModule({
  declarations: [DnbRolesDirective, MaxLengthDirective, ResizableDirective],
  exports: [DnbRolesDirective, MaxLengthDirective, ResizableDirective],
})
export class DnBDirectivesModule {}
