import { ReferenceInfo } from './reference-info';
import { RuleInfo } from './rule-info';
import { IdeaInfo } from './idea-info';

export class EclReference {

    eclReferenceId: any;
    eclStage: any;
    rule: RuleInfo;
    idea: IdeaInfo;
    refInfo: ReferenceInfo;
    chapter: string;
    section: string;
    page: string;
    comments: string;
    statusId: number;
    createdBy: any;
    creationDt: Date;
    updatedBy: any;
    updatedOn: Date;
    
    constructor() {
        this.refInfo = new ReferenceInfo();
    }

}