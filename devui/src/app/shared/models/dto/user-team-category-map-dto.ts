export class UserTeamCategoryMapDto {

  userId: number;
  userName: string;
  teamId: number;
  teamName: string;
  functionType: string;
  categoryMappingId: number;
  categoryId: number;
  categoryName: string;
  roleCCA: boolean;
  rolePO: boolean;
  selectedPO: boolean = false;
  selectedCCA: boolean = false;
}
