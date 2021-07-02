import { Injectable } from '@angular/core';
import { Constants } from 'src/app/shared/models/constants';
const jsPDF = require('jspdf');
require('jspdf-autotable');

@Injectable({
    providedIn: 'root'
})
export class JsPdfService {

    /**
    * This method is used to Pdf export.
    * The componente that calls this method, has to have at the html file a table 
    * with the dataSourceTable id, for instance: 
    * <table id="dataSourceTable">
    *  @param header - Table header.
    *  @param pdfName - Pdf name.
    */
    exportToPdf(header: String, pdfName: String) {
        return new Promise(resolve => {
            let pdf = new jsPDF('p', 'mm', 'a4');
           
            var headerTable = function (data) {
                pdf.setFontSize(18);
                pdf.setFontStyle('normal');
                pdf.text(header, data.settings.margin.left, 20);
            };

            pdf.autoTable({ 
                margin: {top: 30},
                beforePageContent: headerTable,
                html: '#dataSourceTable', 
                columnStyles: { 0: {fontStyle: 'bold'}}
            });
            pdf.save(`${pdfName}.pdf`);
            resolve();
        });
    }
}