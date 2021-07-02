import { RuleCodeDto } from './dto/rule-code-dto';

export class ValidateRuleCodeRequest {

  codesList: RuleCodeDto[];
  newCodesList: RuleCodeDto[];
  ruleId : number;
  codeType: string;
  userId : number;

  constructor() {
  }

}
