import { Directive, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { throttleTime } from 'rxjs/operators';

@Directive({
  selector: '[appThrottleTimeClick]'
})
export class ThrottleTimeClickDirective implements OnInit, OnDestroy {

  @Input() throttleTime = 3000;
  @Output() throttleTimeClick = new EventEmitter();
  private clicks = new Subject();
  private subscription: Subscription;

  ngOnInit() {
    this.subscription = this.clicks
      .pipe(throttleTime(this.throttleTime))
      .subscribe(e => this.throttleTimeClick.emit(e));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  @HostListener('click', ['$event'])
  clickEvent(event) {
    event.preventDefault();
    event.stopPropagation();
    this.clicks.next(event);
  }
}
