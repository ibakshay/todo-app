import { Component, OnInit, OnDestroy } from "@angular/core";
import { Post } from "../post.model";
import { PostsService } from "../post.service";
import { Subscription } from "rxjs";
import { PageEvent } from '@angular/material';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: "app-post-list",
  templateUrl: "./post-list.component.html",
  styleUrls: ["./post-list.component.css"]
})
export class PostListComponent implements OnInit, OnDestroy {
  private postListenerSubs: Subscription;
  private authListenerSubs: Subscription
  userIsAuthenticated: boolean
  posts: Post[] = [];
  totalPosts = 100;
  postsPerPage = 10;
  currentPage = 1;
  pageSizeOptions = [2, 5, 10, 20]
  isLoading = false;

  constructor(public postsService: PostsService, private authService: AuthService) { }

  ngOnInit() {
    this.isLoading = true;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
    //subscribing to the service
    this.postListenerSubs = this.postsService
      .getPostUpdateListener()
      .subscribe((posts: Post[]) => {
        this.posts = posts;
        this.isLoading = false;
      });
    //this.userIsAuthenticated = this.authService.getAuthUserIsAuthenticated()
    console.log("post-list component loaded " + this.userIsAuthenticated)
    this.authListenerSubs = this.authService.getAuthStatusListener()
      .subscribe((userIsAuthenticated) => {
        this.userIsAuthenticated = userIsAuthenticated
      })
  }

  onChangePage(pageData: PageEvent) {
    this.currentPage = pageData.pageIndex + 1
    this.postsPerPage = pageData.pageSize
    console.log(`AKSHAY IS A GOOD BOY ${JSON.stringify(pageData)}`)
    this.postsService.getPosts(this.postsPerPage, this.currentPage)
  }

  onDelete(id: string) {
    this.postsService.deletePost(id)
  }

  ngOnDestroy() {
    this.postListenerSubs.unsubscribe()
    this.authListenerSubs.unsubscribe()
  }
}
