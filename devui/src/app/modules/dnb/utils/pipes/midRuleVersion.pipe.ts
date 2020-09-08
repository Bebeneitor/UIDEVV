import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "midRuleVersion",
})
export class MidRuleVersionPipe implements PipeTransform {
  transform(midRule: string = "", version: boolean = false): unknown {
    let midRuleConvert: string = "";

    if (version) {
      midRuleConvert = midRule.split(".")[1];
    } else {
      midRuleConvert = midRule.split(".")[0];
    }

    return midRuleConvert;
  }
}
