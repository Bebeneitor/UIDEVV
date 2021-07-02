export class WhitePaperDto {

    whitePaperId: number;
    whitePaperName: string;
    fileId: number;
    whitePaperLabel: string;
    categories: number[];
    createdDate: Date;
    updatedDate: Date;
    draft: boolean = false;
    public: boolean = false;

    constructor() {
        this.whitePaperId = 0;
        this.whitePaperName = 'New White Paper';
     }

}