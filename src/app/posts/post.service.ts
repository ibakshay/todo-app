import { Post } from "./post.model";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { Injectable } from "@angular/core";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { Content } from "@angular/compiler/src/render3/r3_ast";
import { Router } from "@angular/router"
@Injectable({ providedIn: "root" })
export class PostsService {
  constructor(private httpClient: HttpClient, private router: Router) { }
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  //subscribing to the server
  getPosts(postsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${postsPerPage}&currentpage=${currentPage}`;
    this.httpClient
      .get<{ data: any }>(`http://localhost:3000/api/posts${queryParams}`)
      .pipe(
        map(savedPostData => {
          return savedPostData.data.map(post => {
            return { title: post.title, content: post.content, id: post._id, imagePath: post.imagePath };
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

  // getPost(id: string) {
  //   return { ...this.posts.find(p => p.id === id) }
  // }
  getPost(postId: string) {
    console.log("hello there")
    return this.httpClient.get<{ _id: string, title: string, content: string, imagePath: string }>(`http://localhost:3000/api/posts/get/${postId}`)
  }
  addPost(post: Post, image: File) {
    console.log("can you hear me")
    const postData = new FormData();
    postData.append("title", post.title);
    postData.append("content", post.content);
    postData.append("image", post.title)
    this.httpClient
      .post<any>("http://localhost:3000/api/posts", postData)
      .subscribe(responseData => {
        const responsePost: Post = { id: responseData.post.id, title: post.title, content: post.content, imagePath!: responseData.post.imagePath }
        console.log(responseData);
        post.id = responseData.postId;
        this.posts.push(post);
        //the next method in the subject is a type of observable in which, all the observers who are subscribed and listening  will get a notification that
        //something has changed to the data
        //1. observable https://www.youtube.com/watch?v=1tRLveSyNz8&t=3656s)
        this.postsUpdated.next([...this.posts]);
        this.router.navigate(["/"]);
      });
  }

  editPost(postId: string, post: Post) {
    let postData: Post | FormData;
    if (typeof (post.imagePath) === 'object') {
      postData = new FormData();
      postData.append("id", post.id);
      postData.append("title", post.title);
      postData.append("content", post.content);
      if (post.imagePath) {
        postData.append("image", post.imagePath, post.title);
      }
    }
    else {
      postData = {
        id: post.id,
        title: post.title,
        content: post.content,
        imagePath: post.imagePath
      }
    }
    console.log("post id is " + postId)
    this.httpClient.put(`http://localhost:3000/api/posts/edit/${postId}`, postData)
      .subscribe(responseData => {
        const updatesPosts = [...this.posts]
        const oldPostIndex = updatesPosts.findIndex(p => p.id === post.id);
        const postResponse: Post = {
          id: post.id,
          title: post.title,
          content: post.content,
          imagePath: "responseData.imagePath"
        };
        updatesPosts[oldPostIndex] = post
        this.posts = updatesPosts;
        this.postsUpdated.next([...this.posts]);
        this.router.navigate(["/"]);
      })
  }

  deletePost(postId: string) {
    this.httpClient
      .delete(`http://localhost:3000/api/posts/delete/${postId}`)
      .subscribe(() => {
        console.log(postId);
        const updatesPosts = this.posts.filter(post => post.id !== postId);
        this.posts = updatesPosts;
        console.log("the updated post is " + JSON.stringify(this.posts));
        this.postsUpdated.next([...this.posts]);
      });
  }
}
