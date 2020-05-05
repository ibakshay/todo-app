import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm, FormGroup, FormControl, Validators } from "@angular/forms";
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent implements OnInit, OnDestroy {
  isLoading = false;
  private authListenerSubs: Subscription
  userIsAuthenticated: boolean = false
  form: FormGroup;
  constructor(public authService: AuthService) {

  }

  ngOnInit() {
    this.form = new FormGroup({
      'title': new FormControl(null, { validators: [Validators.required, Validators.minLength(3)] }),
      'email': new FormControl(null, { validators: [Validators.required] }),
    });
    this.authListenerSubs = this.authService.getAuthStatusListener().subscribe((userIsAuthenticated) => {
      if (userIsAuthenticated == false) {
        this.isLoading = false
      }
    })
  }

  onLogin(form: NgForm) {

    console.log(form)
    if (form.invalid) {
      return;
    }
    this.isLoading = true
    this.authService.login(form.value.email, form.value.password)

  }
  ngOnDestroy() {
    this.authListenerSubs.unsubscribe()
  }

}
