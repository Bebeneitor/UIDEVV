import { SafeUrl } from "@angular/platform-browser";
import { FilterTagSequenceDto } from "./dto/filter-tag-sequence-dto";

export class EclFileDto{
	fileId : number;	
    fileName : string; 
    fileType : string;
    mimeType : string;
    filePath : string;
    isRemoved : boolean = null;
    newFile : File = null;
    isAdded : boolean = null;
    image : any  = null;
    refSrcUrl : SafeUrl;
    isImage : boolean = false;
    isExisting : boolean = null;

    constructor(file : File, isAdded : boolean) {
        this.newFile = file;
        this.isAdded = isAdded;
    }
}