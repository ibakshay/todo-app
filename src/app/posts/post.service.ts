import { Post } from "./post.model";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { Injectable } from "@angular/core";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { Content } from "@angular/compiler/src/render3/r3_ast";

@Injectable({ providedIn: "root" })
export class PostsService {
  constructor(private httpClient: HttpClient) {}
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  //subscribing to the server
  getPosts() {
    this.httpClient
      .get<{ data: any }>("http://localhost:3000/api/posts")
      .pipe(
        map(savedPostData => {
          return savedPostData.data.map(post => {
            return { title: post.title, content: post.content, id: post._id };
          });
        })
      )
      .subscribe(transformedSavedPostData => {
        this.posts = transformedSavedPostData;
        this.postsUpdated.next([...this.posts]);
      });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  addPost(post: Post) {
    this.httpClient
      .post<{ message: String }>("http://localhost:3000/api/posts", post)
      .subscribe(responseData => {
        console.log(responseData.message);
        this.posts.push(post);
        //the next method in the subject is a type of observable in which, all the observers who are subscribed and listening  will get a notification that
        //something has changed to the data
        //1. observable https://www.youtube.com/watch?v=1tRLveSyNz8&t=3656s
        this.postsUpdated.next([...this.posts]);
      });
  }

  deletePost(postId: string) {
    this.httpClient
      .delete(`http://localhost:3000/api/posts/${postId}`)
      .subscribe(() => {
        console.log(postId);
        const updatedPosts = this.posts.filter(post => {
          return post.id !== postId;
        });
        this.posts = updatedPosts;

        console.log("the updated post is " + JSON.stringify(this.posts));
        this.postsUpdated.next([...this.posts]);
      });
  }
}
