import { Role } from './roles';
import { Functionality } from './functionality';

export class RoleFunctionality {

    roleFunctionalityId: number;
    role : Role;
    functionality: Functionality;
    readWriteAccess: any;

    constructor(){

    }
}