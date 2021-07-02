import { Users } from './users';

export class RuleEngines{
    ruleEngineId: number;
    ruleEngineShortDesc: string;
    ruleEngineDesc:string;
    statusId: number;
    createdBy: Users;
    createdDt: Date;
    updatedBy: Users;
    updatedDt: Date;

    constructor(){
        this.createdBy = new Users();
        this.updatedBy = new Users();
    }
}