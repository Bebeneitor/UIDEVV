import { NgModule } from "@angular/core";
import { MidRuleVersionPipe } from "./midRuleVersion.pipe";

@NgModule({
  declarations: [MidRuleVersionPipe],
  exports: [MidRuleVersionPipe],
})
export class PipesModule {}
