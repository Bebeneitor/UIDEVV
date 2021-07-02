import { Component, Input, Output, EventEmitter, OnInit } from "@angular/core";
import {ResearchRequestLoginService} from "../../../services/research-request-login.service";
import {Constants} from "../../models/constants";
import {ToastMessageService} from "../../../services/toast-message.service";
import * as CryptoJS from 'crypto-js';
import {StorageService} from "../../../services/storage.service";
import {Router} from "@angular/router";


@Component({
  selector: 'app-research-request-login',
  templateUrl: './research-request-login.component.html',
  styleUrls: ['./research-request-login.component.css']
})
export class ResearchRequestLoginComponent implements OnInit{

  @Input() rrLoginDialog: boolean = false;
  @Input() rrNavReqType: string;
  @Output() hideDialog: EventEmitter<boolean> = new EventEmitter();
  @Input() setUpRrDialog: {
    header: string;
    buttonCancel: boolean;
    jiraUserName: string;
    password: string;
    valueButton: string;
  };
  @Output() hideDialogChange: EventEmitter<boolean> = new EventEmitter();
  header: any;
  return: string = '';
  isJiraLoggedIn: boolean;
  loading: boolean;

  secretKey: any = '12345123451234512345123451234509';
  constructor(
    private rrLoginService: ResearchRequestLoginService,
    private toastService: ToastMessageService,
    private storageService: StorageService,
    private router: Router) { }

  ngOnInit() {
    this.isJiraLoggedIn = false;
  }

  dialogHidden() {
    this.hideDialogChange.emit(false);
  }


  /**
   * Validate login (Click button)
   */
  login() {
    let encryptPass = this.encryptFinal(this.setUpRrDialog.password, this.secretKey);
    this.rrLoginService.submitCIJiraLogin({
      userId: this.setUpRrDialog.jiraUserName,
      encryptPass: encryptPass
    }).subscribe((response: any) => {
      if (response.code === Constants.HTTP_OK && response.message === 'valid') {
        this.isJiraLoggedIn = true;
        this.encryptUserData();
        let successMessage = `CI-Jira user Login successfully.`;
        this.toastService.messageSuccess(Constants.TOAST_SUMMARY_SUCCESS, successMessage, 3000, true);
        this.rrLoginDialog = false;
        this.redirectToReqPage();
      } else if (response.code === Constants.HTTP_OK && response.message === 'Unauthorized') {
        this.isJiraLoggedIn = false;
        this.toastService.messageError(Constants.TOAST_SEVERITY_ERROR, `The User is Unauthorized.`, 3000, true);
        this.rrLoginDialog = false;
      } else {
        this.isJiraLoggedIn = false;
        this.toastService.messageError(Constants.TOAST_SEVERITY_ERROR, `The user is not valid.`, 3000, true);
        this.rrLoginDialog = false;
      }
      this.trackJiraLogin();
    });
  }

  encryptUserData() {
    let encryptPass = this.encryptFinal(this.setUpRrDialog.password, this.secretKey);
    this.storageService.set('ENCRYPT_USER_DATA', {username: this.setUpRrDialog.jiraUserName, password: encryptPass}, true);
  }

  encryptFinal(pass: string, key): string {
    let secret_key = CryptoJS.enc.Hex.parse(key);
    let secret_iv = CryptoJS.enc.Hex.parse(key);
    return CryptoJS.AES.encrypt(
      pass,
      secret_key,
      {
        iv: secret_iv,
      }
    ).toString();
  }

  private redirectToReqPage() {
    if (this.rrNavReqType && this.rrNavReqType === Constants.NEW_RR_ROUTE_PAGE) {
      this.router.navigate(['/new-research-request']);
    } else if (this.rrNavReqType && this.rrNavReqType === Constants.MY_RR_ROUTE_PAGE) {
      this.router.navigate(['/my-research-request']);
    } else if (this.rrNavReqType && this.rrNavReqType === Constants.UNASSIGNED_RR_ROUTE_PAGE) {
      this.router.navigate(['/unassigned-research-request']);
    } else if (this.rrNavReqType && this.rrNavReqType === Constants.REASSIGNED_RR_ROUTE_PAGE) {
      this.router.navigate(['/reassignment-research-request']);
    } else if (this.rrNavReqType && this.rrNavReqType === Constants.REQUEST_SEARCH_ROUTE_PAGE) {
      this.router.navigate(['/search-research-request']);
    }
  }

  private trackJiraLogin() {
    this.storageService.set('TRACK_JIRA_USER_LOGIN', (this.isJiraLoggedIn) ? this.isJiraLoggedIn : false, true);
  }
}
