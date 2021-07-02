import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfirmationDialogService } from '../modules/confirmation-dialog/confirmation-dialog.service';

@Injectable({
  providedIn: "root"
})
export class VersionCheckService {
  // 5 minutes
  frequency: number = 300000;
  // this will be replaced by actual hash post-build.js
  private currentHash = '{{POST_BUILD_ENTERS_HASH_HERE}}';

  constructor(private http: HttpClient, private confirmationService: ConfirmationDialogService) {  }

  /**
   * Checks in every set frequency the version of frontend application
   * @param url
   */
  public initVersionCheck(url) {
    // Check for the first login and not wait 5 minutes.
    this.checkVersion(url);
    setInterval(() => {
      this.checkVersion(url);
    }, this.frequency);
  }

  /**
   * Will do the call and check if the hash has changed or not
   * @param url
   */
  private checkVersion(url) {
    // timestamp these requests to invalidate caches
    this.http.get(url)
      .subscribe(
        (response: any) => {

          const hash = response.hash;
          const hashChanged = this.hasHashChanged(this.currentHash, hash);

          // If new version,  ask to reload page.
          if (hashChanged) {
            console.log(`Response hash => ${hash}, Current hash => ${this.currentHash}, hash has changed.`);
            this.confirmationService.confirm('',
              'A new ECL version has been deployed, do you want to refresh?',
              'Refresh now',
              'Not now',
              'sm',
              'static',
              false).then((confirmed) => {
                if (confirmed) {
                  location.reload();
                } else {
                  this.currentHash = "";
                }
              });
          } else {
            // store the new hash so we wouldn't trigger versionChange again
            // only necessary in case you did not force refresh
            this.currentHash = hash;
          }

        });
  }

  /**
   * Checks if hash has changed.
   * This file has the JS hash, if it is a different one than in the version.json
   * we are dealing with version change
   * @param currentHash
   * @param newHash
   * @returns {boolean}
   */
  private hasHashChanged(currentHash, newHash) {
    if (currentHash === null || currentHash === undefined || currentHash === '{{POST_BUILD_ENTERS_HASH_HERE}}') {
      return false;
    }

    return currentHash !== newHash;
  }
}