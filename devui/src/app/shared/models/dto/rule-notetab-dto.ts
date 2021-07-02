import { RuleNoteAttachmentsDto } from '../rule-note-attachments';
import { EclComments } from '../ecl-comments';
import { RuleNotes } from '../rule-notes';
import { Users } from '../users';

export class RuleNoteTabDto {

    ruleNotesDto : RuleNotes = null;
	existingCommentsList : EclComments[] = [];
	newCommentsDto : EclComments = null;
    activeAttachmentList : RuleNoteAttachmentsDto[] = [];
    constructor() {
  
    }
}