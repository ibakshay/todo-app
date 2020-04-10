import { Component, OnInit, OnDestroy } from "@angular/core";
import { Post } from "../post.model";
import { PostsService } from "../post.service";
import { Subscription } from "rxjs";
import { PageEvent } from '@angular/material';

@Component({
  selector: "app-post-list",
  templateUrl: "./post-list.component.html",
  styleUrls: ["./post-list.component.css"]
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  totalPosts = 100;
  postsPerPage = 10;
  currentPage = 1;
  pageSizeOptions = [2, 5, 10, 20]
  isLoading = false;
  private postsSubscription: Subscription;

  constructor(public postsService: PostsService) { }

  ngOnInit() {
    this.isLoading = true;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
    //subscribing to the service
    this.postsSubscription = this.postsService
      .getPostUpdateListener()
      .subscribe((posts: Post[]) => {
        this.posts = posts;
        this.isLoading = false;
      });
  }
  onChangePage(pageData: PageEvent) {
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    console.log(`AKSHAY IS A GOOD BOY ${JSON.stringify(pageData)}`);
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
  }
  onDelete(id: string) {
    this.postsService.deletePost(id);
  }
  ngOnDestroy() {
    this.postsSubscription.unsubscribe();
  }
}
