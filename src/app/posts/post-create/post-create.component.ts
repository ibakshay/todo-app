import { Component, OnInit } from "@angular/core";
import { Post } from "../post.model";
import { NgForm } from "@angular/forms";
import { from } from "rxjs";
import { PostsService } from "../post.service";
@Component({
  selector: "app-post-create",
  templateUrl: "./post-create.component.html",
  styleUrls: ["./post-create.component.css"]
})
export class PostCreateComponent implements OnInit {
  constructor(public postsService: PostsService) { }
  ngOnInit() { }
  newPost = "No Content so far";
  onAddPost(form: NgForm) {
    if (form.invalid) {
      return;
    }
    const post: Post = {
      id: null,
      title: form.value.title,
      content: form.value.content
    };
    this.postsService.addPost(post);
    form.resetForm();
  }
}
