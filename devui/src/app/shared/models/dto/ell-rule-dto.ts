import { EllPolicyDto } from './ell-policy-dto';
import { EllTopicDto } from './ell-topic-dto';
import { EllDecisionPointDto } from './ell-decision-point-dto';
import { EllSubRuleDto } from './ell-sub-rule-dto';

export class EllRuleDto{
    vmidRuleKey                     : number;       //Rule key - unique key.
    midRuleKey                      : number;       //Rule key, this key can be repeated.
    ruleVersion                     : number;       //Rule version.
    releaseLogKey                   : number;
    subRuleKey                      : number; 
    eclRuleId                       : number;
    eclRuleCode                     : string;
    eclRuleNumber                   : string;
    eclRuleVersion                  : string;
    productType                     : string[];
    claimTypesInDecision            : string[];
    primRefSourceKey                : number;
    primRefSourceDesc               : string;
    primRefTitleKey                 : number;
    primRefTitleDesc                : string;
    dosFrom                         : Date;
    dosTo                           : Date;
    primCoreEnhancedKey             : number;
    primCoreEnhancedDesc            : string;
    industryUpdInd                  : string;
    reasonCode                      : string;
    outPatientHospital              : string;
    podMidRule10                    : number;
    realTimeMidRule10               : number;
    editFlag                        : number;

    ellSubRuleDto                   = new EllSubRuleDto();
    ellPolicyDto                    = new EllPolicyDto();
    ellTopicDto                     = new EllTopicDto();
    ellDecisionDto                  = new EllDecisionPointDto();
}
