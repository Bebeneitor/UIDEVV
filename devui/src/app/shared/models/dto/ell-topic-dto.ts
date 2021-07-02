import { EllPolicyDto } from './ell-policy-dto';
import { EllDecisionPointDto } from './ell-decision-point-dto';

export class EllTopicDto{
    topicKey              : number                      //Topic key.
    topicTitle            : string                      //Topic title.
    topicDescHtml         : string                      //Topic title in html format.
    topicExampleHtml      : string                      //Topic example in html format.
    topicType             : string                      //Topic title.
    releaseLogKey         : number                      //Release key.
    ellPolicyDto          = new EllPolicyDto();         //Policy that belongs to this topic.
    decisionPoints        : EllDecisionPointDto[];      //Decisions that belong to this topic.
}
