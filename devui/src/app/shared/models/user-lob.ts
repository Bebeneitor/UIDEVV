import { Users } from './users';
import { LineOfBusiness } from './line-of-business';

export class UserLOB {

    userLobId: number;
	// tslint:disable: indent
	// tslint:disable: no-trailing-whitespace
	user: Users;
	lob: LineOfBusiness;

	   constructor() {

		this.user = new Users();

	}
	
}