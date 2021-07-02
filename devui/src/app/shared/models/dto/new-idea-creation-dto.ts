import { Users } from '../users';
import { EclReference } from '../ecl-reference';

export class NewIdeaCreationDto {
    ideaId: number;
    ideaName: any;
    ideaCode: string;
    ideaDescription: string;
    statusId: number;
    createdDt: Date;
    createdBy: Users;
    updatedBy: any;
    updatedOn: Date;
    eclReferences: EclReference[];
    eclWorkflows: any[];

}