import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class ToastMessageService {

  INFO: string = 'info';
  ERROR: string = 'error';
  SUCCESS: string = 'success';
  WARNING: string = 'warn';

  constructor(private messageService: MessageService) { }

  messageInfo(summary: string, detail: string, life: number = 3000, closable: boolean = false) {
    return new Promise((resolve) => {
      this.message(this.INFO, summary, detail, life, closable).then(response => {
        resolve(response)
      });
    });
  }

  messageSuccess(summary: string, detail: string, life: number = 3000, closable: boolean = false) {
    return new Promise((resolve) => {
      this.message(this.SUCCESS, summary, detail, life, closable).then(response => {
        resolve(response)
      });
    });
  }

  messageWarning(summary: string, detail: string, life: number = 3000, closable: boolean = false) {
    return new Promise((resolve) => {
      this.message(this.WARNING, summary, detail, life, closable).then(response => {
        resolve(response)
      });
    });
  }

  messageError(summary: string, detail: string, life: number = 3000, closable: boolean = false) {
    return new Promise((resolve) => {
      this.message(this.ERROR, summary, detail, life, closable).then(response => {
        resolve(response)
      });
    });
  }

  message(severity: string, summary: string, detail: string, life: number = 3000, closable: boolean = false) {
    return new Promise((resolve) => {
      this.messageService.add({ key: 'globalToast', severity: severity, summary: summary, detail: detail, life: life, closable: closable });

      setTimeout(function () {
        resolve();
      }, life);
    });

  }

  messages(severity: string, summary: string, detail: string[], life: number = 3000, closable: boolean = false) {
    return new Promise((resolve) => {

      let messages = [];

      detail.forEach(item => {
        messages.push({ key: 'globalToast', severity: severity, summary: summary, detail: item, life: life, closable: closable });
      })

      this.messageService.addAll(messages);

      setTimeout(function () {
        resolve();
      }, life);
    });

  }
}
