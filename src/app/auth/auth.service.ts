import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from "rxjs";
import { map } from "rxjs/operators";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { Content } from "@angular/compiler/src/render3/r3_ast";
import { Router } from "@angular/router"
import { AuthData } from './auth-data.model';

@Injectable({ providedIn: "root" })
export class AuthService {
  private token: string
  private userIsAuthenticated = false;
  /**BehaviourSubject keeps in memory the last value that was emitted by the observable. Regular subject don`t.
   * 
   */
  private authStatusListener = new BehaviorSubject<boolean>(false)


  constructor(private httpClient: HttpClient, private router: Router) { }
  getToken(): string {
    return this.token
  }

  getAuthUserIsAuthenticated(): boolean {
    return this.userIsAuthenticated
  }
  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  createUser(email: string, password: string) {
    const authData: AuthData = { email: email, password: password };
    this.httpClient.post<any>("http://localhost:3000/api/user/signup", authData).subscribe(response => {
      console.log(response)
    })

  }
  login(email: string, password: string) {
    const authData: AuthData = { email: email, password: password };
    this.httpClient.post<{ token: string }>("http://localhost:3000/api/user/login", authData).subscribe(response => {
      console.log(response);
      this.token = response.token;
      if (this.token) {
        this.userIsAuthenticated = true;
        this.authStatusListener.next(true)
      }

    })

  }

  Logout() {
    this.token = null
    this.userIsAuthenticated = false;
    this.authStatusListener.next(false)
  }
}
