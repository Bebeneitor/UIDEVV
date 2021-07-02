import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { StorageService } from './storage.service';
import { WhitePaperDto } from '../shared/models/dto/white-paper-dto';
import { BaseResponse } from '../shared/models/base-response';
import { FileManagerService } from '../shared/services/file-manager.service'
import { environment } from 'src/environments/environment';
import { RoutingConstants } from '../shared/models/routing-constants';

@Injectable({
  providedIn: 'root'
})
export class WhitePaperService {

  constructor(private http: HttpClient, private storage: StorageService,
    private fileManagerService: FileManagerService) { }

  /**
   * Save white paper in data base
   */
  save(whitePaper: WhitePaperDto) {
    return this.http.post(environment.restServiceUrl + RoutingConstants.WHITE_PAPER + '/' + RoutingConstants.WHITE_PAPER_SAVE, whitePaper);
  }

  /**
   * Update white paper in data base
   * @param whitePaper 
   */
  update(whitePaper: WhitePaperDto) {
    return this.http.put(environment.restServiceUrl + RoutingConstants.WHITE_PAPER + '/' + RoutingConstants.WHITE_PAPER_UPDATE + '?whitePaperId=' + whitePaper.whitePaperId, whitePaper);
  }

  /**
   * Load white papers by user from data base
   */
  loadByUser() {
    return this.http.get(environment.restServiceUrl + RoutingConstants.WHITE_PAPER + '/' + RoutingConstants.WHITE_PAPER_LOAD);
  }

  /**
   * Load white papers shared with my user
   * @param userId 
   */
  loadSharedWithMe(userId: number) {
    return this.http.get(environment.restServiceUrl + RoutingConstants.WHITE_PAPER + '/' + RoutingConstants.WHITE_PAPERS_SHARED_WHIT_ME + '?userId=' + userId);
  }

  /**
   * Search white paper(s) by name, label or category
   * @param keyword 
   */
  searchWhitePaper(keyword: string, isPublic: boolean, loadAll: boolean) {
    return this.http.get(environment.restServiceUrl + RoutingConstants.WHITE_PAPER + '/' + RoutingConstants.WHITE_PAPER_SEARCH + '?keyword=' + keyword + '&isPublic=' + isPublic + '&loadAll=' + loadAll);
  }

  /**
   * Upload white paper text file
   * @param whitePaper 
   */
  uploadWhitePaper(whitePaperData, whitePaper) {
    return new Promise(resolve => {

      if (whitePaper.draft && whitePaper.whitePaperId > 0 && whitePaper.fileId > 0) {
        this.fileManagerService.removeFile(whitePaper.fileId);
      }

      let file = new File([JSON.stringify(whitePaperData)], (new Date()).getTime() + "_WP.json");
      this.fileManagerService.uploadFile(file).subscribe((response: BaseResponse) => {
        resolve(response.data);
      });
    });
  }

  /**
   * Get users binded with a white paper
   * @param whitePaperId 
   */
  getSharedUsers(whitePaperId: number) {
    return this.http.get(environment.restServiceUrl + RoutingConstants.WHITE_PAPER + '/' + RoutingConstants.WHITE_PAPERS_USERS_SHARED + '?whitePaperFileId=' + whitePaperId);
  }

  /**
   * Share white papers with users
   * @param whitePaperId 
   * @param users 
   * @param update 
   */
  share(whitePaperId: number, users: number[]) {
    return this.http.post(environment.restServiceUrl + RoutingConstants.WHITE_PAPER + '/' + RoutingConstants.WHITE_PAPERS_SHARE, {
      whitePaperInstanceId: whitePaperId,
      whitePaperSharedUsers: users
    });
  }

  /**
   * Download white paper file and get text content
   * @param fileId 
   */
  downloadWhitePaper(fileId: number) {
    return new Promise(resolve => {
      this.fileManagerService.downloadFile(fileId).subscribe(response => {
        this.fileManagerService.getTextFromBlob(response).then((text: string) => {
          let data = JSON.parse(text);
          data.forEach(item => {
            item.selected = false;
          });
          resolve(data);
        });
      });
    });
  }
}
