import { DOCUMENT } from "@angular/common";
import { Directive, ElementRef, Inject, Input, Output } from "@angular/core";
import { fromEvent } from "rxjs";
import {
  distinctUntilChanged,
  map,
  switchMap,
  takeUntil,
  tap,
} from "rxjs/operators";

@Directive({
  selector: "[resizable]",
})
export class ResizableDirective {
  padding = 60;
  @Input() width: number = null;
  @Input() nextColWidth: number = null;
  @Output()
  readonly resizable = fromEvent<MouseEvent>(
    this.elementRef.nativeElement,
    "mousedown"
  ).pipe(
    tap((e) => e.preventDefault()),
    switchMap(() => {
      const { width, right } = this.elementRef.nativeElement
        .closest("th")!
        .getBoundingClientRect();
      const table = this.elementRef.nativeElement
        .closest("table")!
        .getBoundingClientRect();
      return fromEvent<MouseEvent>(this.documentRef, "mousemove").pipe(
        map(({ clientX }) => {
          let newColW = width + clientX - right;
          if (newColW < this.padding) {
            newColW = this.padding;
          }
          const nextColWidthPx = (table.width * this.nextColWidth) / 100;
          const colWidthPx = (table.width * this.width) / 100;
          const limit = colWidthPx + nextColWidthPx - this.padding;
          if (newColW > limit) {
            newColW = limit;
          }
          return +((newColW / table.width) * 100).toFixed();
        }),
        distinctUntilChanged(),
        takeUntil(fromEvent(this.documentRef, "mouseup"))
      );
    })
  );

  constructor(
    @Inject(DOCUMENT) private readonly documentRef: Document,
    @Inject(ElementRef)
    private readonly elementRef: ElementRef<HTMLElement>
  ) {}
}
