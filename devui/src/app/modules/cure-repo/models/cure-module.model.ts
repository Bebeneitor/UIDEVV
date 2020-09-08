import { Attribute } from './cure-attibute.model';

export interface Module {
    id: number;
    name: string;
    attributes: Attribute[];

    cmId: number;
    moduleName: string;
    statusId: number;
    createdBy: number;
    creationDate: Date;
    updatedBy: number;
    updatedAt: Date;
}
