import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm, FormGroup, FormControl, Validators } from "@angular/forms";
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.css"]
})
export class SignupComponent implements OnInit, OnDestroy {
  isLoading = false;
  private authListenerSubs: Subscription
  userIsAuthenticated: boolean = false
  form: FormGroup;
  constructor(public authservice: AuthService) {

  }

  ngOnInit() {
    this.form = new FormGroup({
      'title': new FormControl(null, { validators: [Validators.required, Validators.minLength(3)] }),
      'email': new FormControl(null, { validators: [Validators.required] }),
    });
    this.authListenerSubs = this.authservice.getAuthStatusListener().subscribe((userIsAuthenticated) => {
      if (userIsAuthenticated == false)
        this.isLoading = false
    })
  }


  onSignup(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    this.authservice.createUser(form.value.email, form.value.password)
  }
  ngOnDestroy() {
    this.authListenerSubs.unsubscribe()
  }

}
