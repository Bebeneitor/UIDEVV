export class FilterDto {
   
   filterId: number;
   filterName: string;
   filterCondition: string;
   filterType: string;
   screenName: string;
   isEditDeleteAllowed : boolean;
   disableView: boolean
   constructor(){}
   
}