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
  private tokenTimer: any
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
    this.httpClient.post<{ token: string, expiresIn: number }>("http://localhost:3000/api/user/signup", authData).subscribe(response => {
      console.log(response)
      this.token = response.token
      if (this.token) {
        const expiresIn = response.expiresIn
        this.setAuthTimer(expiresIn)
        this.userIsAuthenticated = true
        this.authStatusListener.next(true)
        const now = new Date()
        const expirationDate = new Date(now.getTime() + expiresIn * 1000)
        console.log("expirationDate: " + expirationDate)
        this.saveAuthData(this.token, expirationDate)
        this.router.navigate(['/'])
      }
    }, error => {
      console.log(error)
      this.authStatusListener.next(false)
    })

  }
  login(email: string, password: string) {
    const authData: AuthData = { email: email, password: password };
    this.httpClient.post<{ token: string, expiresIn: number }>("http://localhost:3000/api/user/login", authData).subscribe(response => {
      this.token = response.token;
      console.log("Iam here")
      if (this.token) {
        const expiresIn = response.expiresIn
        this.setAuthTimer(expiresIn)
        this.userIsAuthenticated = true;
        this.authStatusListener.next(true)
        const now = new Date()
        const expirationDate = new Date(now.getTime() + expiresIn * 1000)
        console.log("expirationDate: " + expirationDate)
        this.saveAuthData(this.token, expirationDate)
        this.router.navigate(['/'])
      }

    }, error => {
      console.log(error)
      this.authStatusListener.next(false)
    })

  }

  autoAuthUser() {
    const authInformation = this.getAuthData() // from the localStorage
    if (!authInformation) { return }
    const date = new Date()
    const expiresIn = authInformation.expirationDate.getTime() - date.getTime()
    if (expiresIn > 0) {
      this.token = authInformation.token
      this.userIsAuthenticated = true
      this.setAuthTimer(expiresIn / 1000)
      this.authStatusListener.next(true)

    }
  }

  public Logout() {
    this.token = null
    this.userIsAuthenticated = false;
    this.authStatusListener.next(false)
    this.clearAuthData()
    this.router.navigate(['/login'])
    clearTimeout(this.tokenTimer)
  }

  private saveAuthData(token: string, expirationDate: Date) {
    localStorage.setItem('token', token)
    localStorage.setItem('expirationDate', expirationDate.toISOString())
  }

  private clearAuthData() {
    localStorage.removeItem("token")
    localStorage.removeItem("expirationDate")

  }

  private getAuthData() {
    const token = localStorage.getItem("token")
    const expirationDate = localStorage.getItem("expirationDate")
    if (!token || !expirationDate) {
      return
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate)

    }
  }

  private setAuthTimer(expiresIn) {
    console.log("setting timer : " + expiresIn)
    setTimeout(() => {
      this.Logout()
    }, expiresIn * 1000)
  }
}
