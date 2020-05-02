import { Component } from '@angular/core';
import { NgForm, FormGroup, FormControl, Validators } from "@angular/forms";
import { AuthService } from '../auth.service';

@Component({
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.css"]
})
export class SignupComponent {
  isLoading = false;
  form: FormGroup;
  constructor(public authservice: AuthService) {

  }

  ngOnInit() {
    this.form = new FormGroup({
      'title': new FormControl(null, { validators: [Validators.required, Validators.minLength(3)] }),
      'email': new FormControl(null, { validators: [Validators.required] }),
    });
  }


  onSignup(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    this.authservice.createUser(form.value.email, form.value.password)
  }

}
