import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  ViewChild,
} from "@angular/core";
import { Dialog } from "primeng/dialog";
import { MidRule } from "../../../models/interfaces/midRule";
import { DnBMidrulesService } from "../../../services/dnb-midrules.service";

@Component({
  selector: "app-mid-rules-list",
  templateUrl: "./mid-rules-list.component.html",
  styleUrls: ["./mid-rules-list.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MidRulesListComponent implements OnChanges {
  @Input() openDialog: boolean = false;
  @Output() selectionSet: EventEmitter<string> = new EventEmitter();
  @Output() openDialogChange: EventEmitter<boolean> = new EventEmitter();
  @ViewChild("dialog",{static: false}) dialog: Dialog;
  midRules: MidRule[];
  constructor(
    private midRuleServide: DnBMidrulesService,
    private dc: ChangeDetectorRef
  ) {}

  ngOnChanges() {
    if (this.openDialog) {
      this.loadData();
    }
  }

  loadData() {
    this.midRuleServide.getMidRules().subscribe((response) => {
      this.midRules = response;
      this.dc.detectChanges();
      this.dialog.center();
    });
  }

  dialogSelected(selection) {
    selection.reasonCode = selection.template;
    this.selectionSet.emit(selection);
    this.dialogHidden();
  }

  dialogHidden() {
    this.openDialogChange.emit(false);
  }
}
