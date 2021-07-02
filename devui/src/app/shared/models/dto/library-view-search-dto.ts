export interface lvsDto {
    lob: number;
    state: number;
    jurisdiction: number;
    category: number;
    ruleDescription: string;
    references: string;
    SourceID: number;
    ruleLogic: string;
    begin: Date;
    end: Date;

    //Pagination
    pageNumber: number;
    pageSize: number;
    rows: number;

    //Sorting
    orderBy: string;
    order: string;

}