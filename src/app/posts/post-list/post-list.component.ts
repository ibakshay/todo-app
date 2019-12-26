import { Component, OnInit, OnDestroy } from "@angular/core";
import { Post } from "../post.model";
import { PostsService } from "../post.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-post-list",
  templateUrl: "./post-list.component.html",
  styleUrls: ["./post-list.component.css"]
})
export class PortListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  private postsSubscription: Subscription;

  constructor(public postsService: PostsService) {}

  ngOnInit() {
    this.postsSubscription = this.postsService
      .getPostUpdateListener()
      .subscribe((posts: Post[]) => {
        this.posts = posts;
      });
  }

  ngOnDestroy() {
    this.postsSubscription.unsubscribe();
  }
}
