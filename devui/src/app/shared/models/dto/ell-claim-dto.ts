import {EllRuleDto} from './ell-rule-dto';

export class EllClaimDto{
    claimTypeInDecision   : string          //Claim type by decision.
    claimTypeByRule       : string          //Claim type by rule.
	ellRuleDtos           : EllRuleDto[];   //List of rules that belong to this claim.
}