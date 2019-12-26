import { Post } from "./post.model";
import { Subject } from "rxjs";
import { Injectable } from "@angular/core";

@Injectable({ providedIn: "root" })
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  getPosts() {
    return [...this.posts];
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  addPost(post: Post) {
    this.posts.push(post);
    //subscribing to the observable
    //1. observable https://www.youtube.com/watch?v=1tRLveSyNz8&t=3656s
    this.postsUpdated.next([...this.posts]);
  }
}
