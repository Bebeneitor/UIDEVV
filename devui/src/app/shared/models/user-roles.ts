import { Users } from './users';
import { Role } from './roles';

export class UserRoles {

    userRoleId: number;
	user: Users;
	role: Role;

	   constructor() {

		this.user = new Users();

	}
	
}