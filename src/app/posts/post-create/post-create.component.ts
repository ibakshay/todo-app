import { Component, OnInit } from "@angular/core";
import { Post } from "../post.model";
import { NgForm, FormGroup, FormControl, Validators } from "@angular/forms";
import { from } from "rxjs";
import { PostsService } from "../post.service";
import { ActivatedRoute, ParamMap } from '@angular/router';
import { mimeType } from './mime-type.validator'
@Component({
  selector: "app-post-create",
  templateUrl: "./post-create.component.html",
  styleUrls: ["./post-create.component.css"]
})
export class PostCreateComponent implements OnInit {
  private mode = 'create';
  private postId: string;
  post: Post;
  isLoading = false;
  form: FormGroup;
  imagePreview: string

  constructor(public postsService: PostsService, public route: ActivatedRoute) { }

  ngOnInit() {
    this.form = new FormGroup({
      'title': new FormControl(null, { validators: [Validators.required, Validators.minLength(3)] }),
      'content': new FormControl(null, { validators: [Validators.required] }),
      'image': new FormControl(null, { validators: [Validators.required], asyncValidators: [mimeType] })
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.isLoading = true;
        this.postsService.getPost(this.postId).subscribe(postData => {
          this.isLoading = false;
          console.log("can you hear me" + JSON.stringify(postData))
          this.post = { id: postData._id, title: postData.title, content: postData.content, imagePath: postData.imagePath }
          this.form.setValue({
            'title': postData.title,
            'content': postData.content,
            'image': postData.imagePath
          })
        });
      } else {
        console.log("hey there ")
        this.mode = 'create';
        this.postId = null;
      }
    })
  }
  newPost = "No Content so far";
  onSavePost() {
    if (this.form.invalid) {
      console.log("can you hear me")
      return;
    }
    const post: Post = {
      id: null,
      title: this.form.value.title,
      content: this.form.value.content,
      imagePath: this.form.value.image
    };
    this.isLoading = true;
    if (this.mode === 'create') {


      this.postsService.addPost(post, this.form.value.image);
    }
    else {
      console.log(this.postId)
      this.postsService.editPost(this.postId, post)
    }
    this.form.reset();
  }
  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ 'image': file })
    this.form.get('image').updateValueAndValidity();
    console.log(file);
    console.log(this.form)
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    }
    reader.readAsDataURL(file);
  }


}
