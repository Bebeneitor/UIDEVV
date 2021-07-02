import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from "@angular/core";
import { StorageService } from "src/app/services/storage.service";
import { ToastMessageService } from "src/app/services/toast-message.service";
import { storageDrug } from "../../models/constants/storage.constants";
import { DnbEllService } from "../../services/dnb-ell.service";

@Component({
  selector: "dnb-app-topic-mapping",
  templateUrl: "./topic-mapping.component.html",
  styleUrls: ["./topic-mapping.component.css"],
})
export class TopicMappingComponent implements OnChanges {
  title = "Edit ELL Topic Mapping";
  @Input() openDialog: boolean = false;
  @Input() ellTopic: string = "";
  @Output() openDialogChange: EventEmitter<boolean> = new EventEmitter();
  @Output() updateData: EventEmitter<boolean> = new EventEmitter();
  drugCode: string;
  drugName: string;
  newTopic: boolean = false;
  openEllRulesFlag: boolean = false;
  readOnlyDialog: true;
  ellTopicDetail: string;
  constructor(
    private ellService: DnbEllService,
    private toastService: ToastMessageService,
    private storageService: StorageService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.openDialog) {
      this.newTopic = false;
      if (this.ellTopic.length === 0) {
        this.newTopic = true;
      }
      this.drugCode = this.storageService.get(storageDrug.drugCode, false);
      this.drugName = this.storageService.get(storageDrug.drugName, false);
    }

    if (changes.ellTopic) {
      this.ellTopicDetail = changes.ellTopic.currentValue;
    }
  }

  applyChanges() {
    if (this.ellTopic.length > 0 && !this.newTopic) {
      this.ellService
        .updateEllTopic({
          drugCode: this.drugCode,
          id: 0,
          topicName: this.ellTopic,
        })
        .subscribe(() => {
          this.toastService.messageSuccess(
            "Success!",
            `Topic name updated successfully.`,
            6000,
            true
          );
          this.openEllRulesFlag = false;
          this.openDialogChange.emit(false);
          this.updateData.emit(true);
        });
    } else if (this.newTopic && this.ellTopic.length > 0) {
      this.ellService
        .createEllTopic({
          drugCode: this.drugCode,
          id: 0,
          topicName: this.ellTopic,
        })
        .subscribe(() => {
          this.toastService.messageSuccess(
            "Success!",
            `Topic name created successfully.`,
            6000,
            true
          );
          this.openEllRulesFlag = false;
          this.openDialogChange.emit(false);
          this.updateData.emit(true);
        });
    } else if (this.ellTopic.length === 0 && !this.newTopic) {
      this.ellService.deleteEllTopic(this.drugCode).subscribe(() => {
        this.toastService.messageSuccess(
          "Success!",
          `Topic name deleted successfully.`,
          6000,
          true
        );
        this.openEllRulesFlag = false;
        this.openDialogChange.emit(false);
        this.updateData.emit(true);
      });
    } else if (this.ellTopic.length === 0 && this.newTopic) {
      this.toastService.messageError(
        "Error!",
        `Enter a Topic name to create a new relation.`,
        6000,
        true
      );
    }
  }

  dialogHidden() {
    this.ellTopic = this.ellTopicDetail;
    this.openDialogChange.emit(false);
  }

  openEllRules() {
    this.readOnlyDialog = true;
    this.openEllRulesFlag = true;
  }

  validateData(keyPress) {
    let value = this.ellTopic.replace(
      new RegExp(/[^-A-Z,()_\d\s./]/, "gi"),
      ""
    );

    if (value.length < this.ellTopic.length) {
      this.toastService.messageWarning(
        "Warning!",
        `Just numbers, letters , parentheses, commas, dots, slash, underscore and dash are allowed.`,
        6000,
        true
      );
      this.ellTopic = value;
    }

    if (this.ellTopic.length > 512) {
      this.toastService.messageWarning(
        "Warning!",
        `Maximum character limit exceeded in Topic field.`,
        6000,
        true
      );
      this.ellTopic = this.ellTopic.slice(0, 512);
    }
  }
}
