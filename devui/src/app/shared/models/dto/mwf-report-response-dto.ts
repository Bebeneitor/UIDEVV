import { MwfClientDto } from './mwf-client-dto';

export class MwfReportResponseDto {
    medicalPolicy: string;
    topic: string;
    decisionPointKey: number;
    decisionPointDesc: string;
    midRuleDotVersion: string;
    subRuleKey: number;
    subRuleDesc: string;
    subRuleNotes: string;
    reRecommendationComments: string;
    raRecommendationDesc: string;
    raLink1: string;
    raLink2: string;
    raLink3: string;
    raReviewDetails:string;
    state: string;
    instanceName: string;
    clients: string;
    payers: string;
    instanceCompletionDt: Date;  
}

