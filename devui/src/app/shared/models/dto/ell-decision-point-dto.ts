import { EllRuleDto } from './ell-rule-dto';
import { EllClaimDto } from './ell-claim-dto';
import { EllMrToMpDto } from './ell-mr-to-mp-dto';
import { EllPolicyDto } from './ell-policy-dto';
import { EllTopicDto } from './ell-topic-dto';

export class EllDecisionPointDto{
    ellPolicyDto        = new EllPolicyDto();       //Policy that belong to this decision.
    ellMrToMpDto        = new EllMrToMpDto();       //Relationship of Medical Rule to Medical Policy that belong to this decision.
    ellTopicDto         = new EllTopicDto();        //Topic that belong to this decision.
    dpKey               : number;                   //Decision key.
    dpDesc              : string;                   //Decision description.
    decisionType        : string;                   //Decision type.
    dpSetupDesc         : string;                   //Setup description in this decision.
    releaseLogKey       : number;                   //Release key
    ellRuleDtos         : EllRuleDto[];             //Rules that belong to this decision.
    claimTypesInDecision : string[];                //Claim types in decision that belong to this decision.
    claimTypesByRule     : EllClaimDto[];           //Claim type by rule that belong to this decision.
}