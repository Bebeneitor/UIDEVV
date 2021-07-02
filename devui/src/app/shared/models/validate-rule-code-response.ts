import { RuleCodeDto } from './dto/rule-code-dto';

export class ValidateRuleCodeResponse {

  ruleCodeList: RuleCodeDto[];
  errorList: any;

  constructor() {
  }

}
