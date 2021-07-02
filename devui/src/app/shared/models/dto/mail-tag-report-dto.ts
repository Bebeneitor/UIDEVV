import { MailDto } from './mail-dto';
import { TagDto } from './tag-dto';

export class MailTagReportDto {

    reportName: string;
    tagId: number;
    mailDto: MailDto;

    constructor() { }

}