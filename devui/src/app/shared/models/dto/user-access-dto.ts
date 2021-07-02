import { UserTeamCategoryMapDto } from './user-team-category-map-dto';

export class UserAccessDto {

    userId: number;
    loggedInUserId: number;
    userName: string;
    password: string;
    firstName: string;
    lastName: string;
    email: string;
    rolesList: number[];
    ruleEnginesList: number[];
    teamsList: number[];
    creationCategoryMapDtoList: UserTeamCategoryMapDto[];
    maintenanceCategoryMapDtoList: UserTeamCategoryMapDto[];
    initials:string

}