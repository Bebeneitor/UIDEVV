import { EclWorkFlowDto } from './ecl-workflow-dto';

export class RuleResearchDto{
    ruleId: number;
    ruleCode: string;
    ruleName: string;
    ruleDescription: string;
    ruleAssignedTo: string;
    categoryDesc: string;
    workflow:EclWorkFlowDto;
}

