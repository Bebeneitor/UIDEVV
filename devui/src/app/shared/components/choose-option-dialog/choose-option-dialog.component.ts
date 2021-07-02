import { Component, Input, Output, EventEmitter, OnInit } from "@angular/core";

@Component({
  selector: "dnb-app-dialog",
  templateUrl: "./choose-option-dialog.component.html",
  styleUrls: ["./choose-option-dialog.component.css"],
})
export class ChooseOptionDialogComponent implements OnInit {
  @Input() openDialog: boolean = false;
  @Input() setUpDialog: {
    header: string;
    container: [];
    buttonCancel: boolean;
    valueButton: string;
    valueDefault: string;
  };
  @Output() selectionSet: EventEmitter<string> = new EventEmitter();
  @Output() openDialogChange: EventEmitter<boolean> = new EventEmitter();
  valueDialog: string = "";
  constructor() {}

  ngOnInit() {
    this.valueDialog = this.setUpDialog.valueDefault;
  }

  dialogHidden() {
    this.openDialogChange.emit(false);
  }

  dialogSelected() {
    this.selectionSet.emit(this.valueDialog);
  }
}
