import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { RepoTableAdminService } from './repo-module-admin/repo-table-admin.service';

@Component({
  selector: 'app-repo-manager',
  templateUrl: './repo-manager.component.html',
  styleUrls: ['./repo-manager.component.css']
})
export class RepoManagerComponent implements OnInit, OnDestroy {
  title: string = '';
  titleSubs: Subscription;
  constructor(private activatedRoute: ActivatedRoute, private router: Router, private repoTableAdminService: RepoTableAdminService) { }


  ngOnInit() {
    this.activatedRoute.url.subscribe(url => {
      if (this.activatedRoute.children.length === 0) {
        this.router.navigate(['/cure-and-repo/repo/module-consulting']);
      }
      this.title = this.activatedRoute.snapshot.children[0].data.pageTitle;
    });

    this.titleSubs = this.repoTableAdminService.setPageTitleObs().subscribe((title) => {
      this.title = title;
    });
  }

  ngOnDestroy(): void {
    this.titleSubs.unsubscribe();
  }
}
