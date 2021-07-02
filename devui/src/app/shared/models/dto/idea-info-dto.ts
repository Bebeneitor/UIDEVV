import { EclReferenceDto } from './ecl-reference-dto';

export class ideaInfoDto {
    ideaCode: String;
    ideaId: number;
    ideaName: String;
    ideaDescription: String;
    categoryDesc: String;
    createDate: Date;
    createdBy: number;
    statusId: number;
    eclStatusDesc: String;
    eclStageDesc: String;
    dupCheckStatus: number;
    eclId: number;
    stageId: number;
    eclReferenceDto: EclReferenceDto[];
}