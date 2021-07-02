import { Injectable } from '@angular/core';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationDialogComponent } from './confirmation-dialog.component';

export type ngbModalBackdropType = boolean | 'static';
@Injectable()
export class ConfirmationDialogService {

  constructor(private modalService: NgbModal) { }

  public confirm(
    title: string,
    message: string,
    btnOkText: string = 'OK',
    btnCancelText: string = 'Cancel',
    dialogSize: 'sm' | 'lg' = 'sm',
    backdrop: ngbModalBackdropType = true,
    keyboard: boolean = true): Promise<boolean> {

    const ngbModalOptions: NgbModalOptions = {
      backdrop: backdrop,
      keyboard: keyboard,
      size: dialogSize
    };

    const modalRef = this.modalService.open(ConfirmationDialogComponent, ngbModalOptions);
    modalRef.componentInstance.title = title;
    modalRef.componentInstance.message = message;
    modalRef.componentInstance.btnOkText = btnOkText;
    modalRef.componentInstance.btnCancelText = btnCancelText;

    return modalRef.result;
  }

}
