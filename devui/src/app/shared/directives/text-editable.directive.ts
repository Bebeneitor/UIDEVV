import { ElementRef, HostListener, Directive, SimpleChanges, EventEmitter, Input, Output } from '@angular/core';

@Directive({
    selector: '[eclModel]'
})
export class TextEditableDirective {

    @Input() eclModel: string;
    @Output() eclModelChange: EventEmitter<string> = new EventEmitter();
    @Output() enterTrigger: EventEmitter<KeyboardEvent> = new EventEmitter();
    @Input('contenteditableHtml') editable: boolean = false;
    private lastViewModel: string;

    constructor(private elRef: ElementRef) { }

    // @HostListener('blur')  // additional fallback
    @HostListener('input') // input event would be sufficient, but isn't supported by IE
    @HostListener('keyup', ['$event']) onInput(event?: KeyboardEvent) {
        if (event && event.key === "Enter") {
            this.enterTrigger.emit(event);
        } else {
            let value = this.elRef.nativeElement.innerText;
            this.eclModelChange.emit(value);
        }
    }

    @HostListener('keydown', ['$event'])
    onKeyDown(event?: KeyboardEvent) {
        if (event && event.key === "Enter") {
            event.preventDefault();
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['eclModel'] && changes['eclModel'].currentValue !== this.lastViewModel) {
            if (changes['eclModel'].isFirstChange() && !this.eclModelChange) {
                this.onInput();
            }
            this.lastViewModel = this.eclModel;
            this.refreshView();
        }
    }

    private refreshView() {
        this.elRef.nativeElement.innerText = this.eclModel
    }

    setCaretPosition(pos: number) {
        let sel: Selection = document.getSelection();
        let range = document.createRange();
        range.collapse();
        sel.removeAllRanges();
        sel.addRange(range);
    }
}