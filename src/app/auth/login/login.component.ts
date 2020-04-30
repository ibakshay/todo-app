import { Component } from '@angular/core';
import { NgForm, FormGroup, FormControl, Validators } from "@angular/forms";
import { AuthService } from '../auth.service';

@Component({
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent {
  isLoading = false;
  form: FormGroup;

  ngOnInit() {
    this.form = new FormGroup({
      'title': new FormControl(null, { validators: [Validators.required, Validators.minLength(3)] }),
      'email': new FormControl(null, { validators: [Validators.required] }),
    });
  }

  constructor(public authservice: AuthService) {

  }



  onLogin(form: NgForm) {

    console.log(form)
    if (form.invalid) {
      return;
    }
    this.authservice.login(form.value.email, form.value.password)

  }

}
