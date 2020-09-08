import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
} from "@angular/core";

@Component({
  selector: "app-dnb-filter-list",
  templateUrl: "./filter-list.component.html",
  styleUrls: ["./filter-list.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterListComponent {
  @Output() filter: EventEmitter<string> = new EventEmitter();
  letterFilter: string = "";
  filterEmit(letter: string) {
    this.letterFilter = letter;
    this.filter.emit(this.letterFilter);
  }
}
