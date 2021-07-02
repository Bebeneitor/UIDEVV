import { PdgReferenceInfoDto } from "./pdg-reference-dto";

export class ReferenceInfoDto {

    referenceId: number;
    referenceName: string;
    referenceTitle: string;
    referenceURL: string;
    refStatusId: number;
    refUrlPublicationDt: Date;
    refurlEdition: string;
    refEffectiveDt: any;
    refLastModifiedDt: any;
    refComments: string;
    refSource: any;
    refUrlFileName: string;
    refUrlFileType: string;
    refDocFileName1: string;
    refDocFileType1: string;
    refDocFileName2: string;
    refDocFileType2: string;
    refEffectiveToDt: Date;
    refEffectiveFromDt: Date;
    refUrlFile: any;
    refDocFile1: any;
    refDocFile2: any;
    referenceURLFileDelete: boolean;
    referenceDoc1Delete: boolean;
    referenceDoc2Delete: boolean;
    pdgRefDto: PdgReferenceInfoDto;
    constructor() {
    }
}