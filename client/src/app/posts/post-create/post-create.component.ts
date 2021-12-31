import { Component, OnInit } from '@angular/core';
import { PostsService } from "../posts.service";
import { NgForm } from "@angular/forms";
import {ActivatedRoute, ParamMap} from "@angular/router";
import { Post } from "../post.model";

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
  post: Post | undefined;
  isLoading = false;
  private mode = "create";
  private postId: string | null = '';

  constructor(
    public postsService: PostsService,
    public route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("postId")) {
        this.mode = "edit";
        this.postId = paramMap.get("postId");
        this.isLoading = true;
        if (this.postId) {
          this.postsService.getPost(this.postId).subscribe(postData => {
            this.isLoading = false;
            this.post = {id: postData._id, title: postData.title, content: postData.content, creator: postData.creator};
          });
        }
      } else {
        this.mode = "create";
        this.postId = null;
      }
    });
  }

  onSavePost(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === "create") {
      this.postsService.addPost(form.value.title, form.value.content);
    } else {
      if (this.postId) {
        this.postsService.updatePost(
          this.postId,
          form.value.title,
          form.value.content
        );
      }
    }
    form.resetForm();
  }

}
