import { LineOfBusiness } from './line-of-business';
import { Jurisdiction } from './jurisdiction';
import { Categories } from './categories';
import { Users } from './users';
import { ReferenceInfo } from './reference-info';
import { States } from './states';
import { EclReference } from './ecl-reference';
import { PolicyPackage } from './policy-package';
import { EclPolicyPackage } from './ecl-policy-package';

export class IdeaInfo {

    ideaId: number;
    ideaName: any;
    ideaCode: string;
    ideaDescription: string;
    lobs: LineOfBusiness;
    jurisdictions: Jurisdiction;
    category: Categories;
    states: States;
    eclPolicyPackages: EclPolicyPackage[];
    dupCheckStatus: number;
    dupCheckComment: string;
    validCheckStatus: number;
    validCheckComment: string;
    statusId: number;
    assignedTo: any;
    createdDt: Date;
    createdBy: any;
    updatedBy: any;
    updatedOn: Date;
    eclReferences: ReferenceInfo[];
    eclWorkflows: any[];
    libraryPrmNumber:string;


    constructor() {
        // this.ideaStatus = new RuleStatus();
    }
}

export class IdeaInfo2 {    
    ideaId: number;
    ideaName: any;
    ideaCode: string;
    ideaDescription: string;
    lobs: LineOfBusiness[];
    jurisdictions: Jurisdiction[];
    category: Categories;
    states: States[];
    eclPolicyPackages: EclPolicyPackage[];
    dupCheckStatus: number;
    dupCheckComments: string;
    validCheckStatus: number;
    validCheckComments: string;
    statusId: number;
    assignedTo: Users;
    createdDt: Date;
    createdBy: Users;
    updatedBy: Users;
    updatedOn: Date;
    eclReferences: EclReference[];
    eclWorkflows: any[];
    libraryPrmNumber:string;

    constructor() {

    }

}