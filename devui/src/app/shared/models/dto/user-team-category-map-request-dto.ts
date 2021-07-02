import { UserTeamCategoryMapDto } from './user-team-category-map-dto';

export class UserTeamCategoryMapRequestDto {

    loggedInUserId: number;
    fieldSelection: string;
    userTeamCategoryMapDtoList: UserTeamCategoryMapDto[];

}