import { Users } from '../users';

export class EclLookupsDto {

    lookupId : number;
    lookupType : string;
    lookupCode : string;
    lookupDesc : string;
    createdBy : Users;
    createdDt : string;
    updatedBy : Users;
    updatedOn : string;
    updatedDt : string;
    statusId : number;

    constructor() {
        this.statusId = 1;
    }
}