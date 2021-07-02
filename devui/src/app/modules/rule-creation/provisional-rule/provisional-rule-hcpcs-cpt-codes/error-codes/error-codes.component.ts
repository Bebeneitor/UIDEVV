import { Component, Input, OnInit } from '@angular/core';
import { ErrorConstants } from 'src/app/shared/models/error-constants';

const INVALID_DATA = 'INVALID_DATA';
const INVALID_CODE_ORDER = 'should be less than';

@Component({
  selector: 'app-error-codes',
  templateUrl: './error-codes.component.html',
  styleUrls: ['./error-codes.component.css']
})
export class ErrorCodesComponent implements OnInit {

  internalError;
  @Input() set errorMap(error) {
    this.internalError = this.sortErrors(error);
  };

  private _radioVal: any;
  @Input() set selectedRadioValue(selected) {
    this._radioVal = selected;
    if (this._radioVal)
      this.errorMap = null;
  }


  constructor() { }

  ngOnInit() {
  }

  showError(error: any) {

    if (error.key != INVALID_DATA) {
      if (error.value.indexOf(INVALID_CODE_ORDER) > -1) {
        return error.value;
      }
      return ErrorConstants[error.key] + ' : ' + error.value;
    } else {
      return ErrorConstants[error.key]
    }

  }

  clearData() {
    this.errorMap = null;
  }

  private sortErrors(error) {
    if (error) {
      let dateErrors = error["INVALID_DATES"] as string[];
      if (dateErrors && dateErrors.length > 0) {
        dateErrors = dateErrors.sort((a, b) => {

          const rowNumberA = +a.slice(-1);
          const rowNumberB = +b.slice(-1);

          if (rowNumberA < rowNumberB) { return -1; }
          if (rowNumberA > rowNumberB) { return 1; }

          return 0;
        });
        error["INVALID_DATES"] = dateErrors;
      }
    }

    return error;
  }

}
