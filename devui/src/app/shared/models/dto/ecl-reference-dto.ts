import { ReferenceInfoDto } from './reference-info-dto';
import { EclAttachments } from '../ecl-attachments';
import { SafeUrl } from '@angular/platform-browser';

export class EclReferenceDto {

    eclReferenceId: number;
    ruleId: number;
    refInfo: ReferenceInfoDto;
    referenceIngested  : string;
    chapter: string;
    section: string;
    page: string;
    comments: string;
    refFile: boolean;
    refFile1: boolean;
    refFile2: boolean;
    user: any;
    referenceSource: number;
    eclStage: number;
    eclAttachmentNameList: any;
    commentsFile1: boolean;
    commentsFile2: boolean;
    eclAttachmentList: any[];
    edition: string;
    removeReferencesFlag:boolean
    removeComments1Attachment: boolean;
    removeComments2Attachment: boolean;
    addedCommentFile1 : File;
    addedCommentFile2 : File;
    addedRefDoc1: File;
    addedRefDoc2: File;
    refSrcComment1: SafeUrl = null;    
    refSrcComment2: SafeUrl = null;      
    refSrcRefDoc1: SafeUrl = null;    
    refSrcRefDoc2 : SafeUrl = null;
    commentsFile1Id: number;	
	commentsFile2Id: number;	
	refFile1Id: number;	
	refFile2Id: number;

    constructor() {
        this.refInfo = new ReferenceInfoDto();
    }
}
