import { Injectable } from '@angular/core';
import { ToastMessageService as Bread } from './toast-message.service';
import { BehaviorSubject } from 'rxjs';
import { PrintData } from "../shared/models/print-data";

@Injectable()
export class PrintService {
    printData: PrintData = {
        title: '',
        data: [],
        cols: [],
        refs: false
    }
    exception = false;
    private printSetup$ = new BehaviorSubject(this.printData);
    public readonly printRun = this.printSetup$.asObservable();

    constructor(private toast: Bread) { }

    /**
     * Receive Print will grab the following information to display and print.
     * @param data It will grab all the data if Selected has none.
     * @param title Display the title for the print to show.
     * @param cols Needs to setup the structure for the table.
     * @param references Determine to create and use reference (Complex).
     */
    ReceivePrint(data, title: string, cols: any, references?: boolean) {
        this.setPrintData(data, title, cols, references);
        if (!this.exception) { this.printSetup$.next(this.printData) }
    }

    // Setting the printData in the storage.
    private setPrintData(data: any[], title: string, cols: any, references?: boolean) {
        try {
            this.printData = {
                title: title,
                data: data,
                cols: cols,
                refs: references
            }
        } catch (e) {
            this.toast.messageError('Exception', 'Print Setup Exception', 3000, false);
            this.exception = true;
        }
    }

}
