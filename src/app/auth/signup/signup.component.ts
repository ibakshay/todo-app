import { Component } from '@angular/core';
import { NgForm, FormGroup, FormControl, Validators } from "@angular/forms";

@Component({
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.css"]
})
export class SignupComponent {
  isLoading = false;
  form: FormGroup;

  ngOnInit() {
    this.form = new FormGroup({
      'title': new FormControl(null, { validators: [Validators.required, Validators.minLength(3)] }),
      'email': new FormControl(null, { validators: [Validators.required] }),
    });
  }


  onSignup(form: NgForm) {

    console.log(form)
  }

}
