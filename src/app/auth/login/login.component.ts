import { Component } from '@angular/core';
import { NgForm, FormGroup, FormControl, Validators } from "@angular/forms";

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


  onLogin(form: NgForm) {

    console.log(form)
  }

}
