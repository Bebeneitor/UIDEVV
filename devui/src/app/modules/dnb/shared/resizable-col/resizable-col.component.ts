import {
  Component,
  EventEmitter,
  HostBinding,
  Input,
  Output,
} from "@angular/core";

@Component({
  selector: "th[resizable]",
  templateUrl: "./resizable-col.component.html",
  styleUrls: ["./resizable-col.component.css"],
})
export class ResizableColComponent {
  @HostBinding("style.width.%")
  @Input()
  width: number | null = null;
  @Input()
  nextColWidth: number | null = null;
  @Output() widthChange: EventEmitter<number> = new EventEmitter();

  onResize(width: number) {
    this.width = width;
    this.widthChange.emit(width);
  }
}
