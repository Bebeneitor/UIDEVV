import { Component, Input, Output, EventEmitter, OnInit } from "@angular/core";

@Component({
  selector: "dnb-app-dialog",
  templateUrl: "./dialog.component.html",
  styleUrls: ["./dialog.component.css"],
})
export class DialogComponent implements OnInit {
  @Input() openDialog: boolean = false;
  @Input() setUpDialog: {
    header: string;
    container: [];
    buttonCancel: boolean;
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
