import { Injectable } from '@angular/core';
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { Content } from "@angular/compiler/src/render3/r3_ast";
import { Router } from "@angular/router"
import { AuthData } from './auth-data.model';

@Injectable({ providedIn: "root" })
export class AuthService {

  constructor(private httpClient: HttpClient, private router: Router) { }
  createUser(email: string, password: string) {
    const authData: AuthData = { email: email, password: password };
    this.httpClient.post<any>("http://localhost:3000/api/user/signup", authData).subscribe(response => {
      console.log(response);
    })

  }
}
