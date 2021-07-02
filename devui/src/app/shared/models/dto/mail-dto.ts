export class MailDto {

    to: string[];
    cc: string[];
    bcc: string[];
    subject: string;
    content: string;
    from: string;

    constructor() {
        this.to = [];
        this.cc = [];
        this.bcc = [];
        this.subject = "";
        this.content = "";
        this.from = "";
    }

}