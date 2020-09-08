import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Constants as c } from 'src/app/shared/models/constants'
import { ToastMessageService } from 'src/app/services/toast-message.service';

@Component({
  selector: 'app-currency-box',
  templateUrl: './currency-box.component.html',
  styleUrls: ['./currency-box.component.css']
})
export class CurrencyBoxComponent implements OnInit {
  @Input() fromMaintenanceProcess: boolean;
  @Input() format: number;
  @Input() originalFormat: number = 0;
  @Input() provDialogDisable: boolean;
  @Output() newFormat: EventEmitter<number> = new EventEmitter();
  stopWatch: any;

  constructor(private toastService: ToastMessageService) { }

  ngOnInit() { }

  // newOppValue - Send new Value back
  newOppValue() {
    this.checkStopWatch();
    const noDecimal = Math.trunc(this.format);
    const length = Math.ceil(Math.log10(noDecimal) + 1);
    if (length >= 14) {
      this.toastService.messageWarning(c.TOAST_SUMMARY_WARN, 'Over Maxmium Limit: Omit last two value', 4000);
      this.format = Math.trunc(this.format / 100)
    }
    this.newFormat.emit(this.format);
  }

  // onKeypress - run stopWatch to ensure values gets updated
  onKeyPress(e) {
    this.checkStopWatch();
    this.stopWatch = setTimeout(() => { this.newOppValue(); }, 2000);
  }

  private checkStopWatch() {
    if (this.stopWatch) { clearTimeout(this.stopWatch); }
  }

}