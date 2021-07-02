import { EclLookupsDto } from './ecl-lookups-dto';
import { EclStageInfoDto } from './ecl-stage-info-dto';

export class EclWorkFlowDto {
    reviewComments: string;
    eclLookup: EclLookupsDto;
    eclStage: EclStageInfoDto;
}