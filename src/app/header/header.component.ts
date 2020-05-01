import { Component, OnInit, OnDestroy } from "@angular/core";
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"]
})
export class HeaderComponent implements OnInit, OnDestroy {

  private authListenerSubs: Subscription
  userIsAuthenticated: boolean = false


  constructor(private authService: AuthService) {

  }

  ngOnInit(): void {
    this.authListenerSubs = this.authService.getAuthStatusListener().subscribe((userIsAuthenticated) => {
      this.userIsAuthenticated = userIsAuthenticated
    })
  }

  onLogout() {
    this.authService.Logout()

  }

  ngOnDestroy(): void {
    this.authListenerSubs.unsubscribe()
  }

}
