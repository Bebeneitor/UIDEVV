import { ReferenceSource } from './reference-source';

export class ReferenceInfo {
    referenceId: number;
    referenceName: string;
    referenceSource: ReferenceSource;
    referenceTitle: string;
    referenceURL: string;
    refUrlFile: any;
    refDocFile1: any;
    refDocFile2: any;
    refUrlPublicationDt: any;
    refurlEdition: string;
    refEffectiveDt: Date;
    refLastModifiedDt: Date;
    refComments: string;
    refStatusId: any;
    refCreatedBy: any;
    refCreationDt: Date;
    refUpdatedBy: any;
    refUpdatedOn: Date;
    refDocFileName1 : string;
    refUrlFileName : string;
    refEffectiveFromDt:any;
    refEffectiveToDt:any;
    refUrlFileType:any;
    refDocFileType1:any;
    refDocFileType2:any;

    constructor() {
        this.referenceSource = new ReferenceSource();
    }

}
