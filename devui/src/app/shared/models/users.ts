import { Role } from './roles';

export class Users {

	userId: number;
	userName: string;
	password: any;
	firstName: string;
	lastName: string;
	email: string;
	skipAssignment:string;
	roleId: Role;
    initials:string;
	constructor() {
		this.roleId = new Role();

	}

}
