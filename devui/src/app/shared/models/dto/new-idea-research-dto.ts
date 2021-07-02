import { Categories } from '../categories';
import { Users } from '../users';
import { EclReference } from '../ecl-reference';

export class NewIdeaResearchDto {
    ideaId: number;
    ideaName: String;
    ideaCode: String;
    ideaDescription: String;
    lobs: number[];
    jurisdictions: number[];
    states: number[];
    category: Categories;
    policyPackages: number[];
    dupCheckStatus: number;
    dupCheckComments: String;
    validCheckStatus: number;
    validCheckComments: String;
    statusId: number;
    createdBy: Users;
    createdDt: Date;
    updatedBy: Users;
    updatedOn: Date;
    eclReferences: EclReference[];
    action: String;
    provisionalRuleId: number;
    libraryPrmNumber: String;

    constructor() {
    }

}