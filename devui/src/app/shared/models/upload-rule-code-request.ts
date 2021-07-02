import { RuleCodeDto } from './dto/rule-code-dto';

export class UploadRuleCodeRequest {
    ruleId: any;
    codeType: string;
    existingRuleCodes: RuleCodeDto[];

    constructor() {
    }
}