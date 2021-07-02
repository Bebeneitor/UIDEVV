import { FilterDto } from './filter-dto';
import { FilterTagSequenceDto } from './filter-tag-sequence-dto';
import { TagSequenceDto } from './tag-sequence-dto';

export class TagDto {

    tagId: number;
    tagName: string;
    tagSequences: TagSequenceDto[];
    filterId: number;
    ruleIds: string[];
    action: string;
    associatedFilterTagSequences: FilterTagSequenceDto[];
    tagSequenceId : number;

    constructor() { }
}   
