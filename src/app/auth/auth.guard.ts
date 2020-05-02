import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
    isAuth: boolean;

    constructor(private authService: AuthService, private router: Router) {

    }
    /**check if user is authenticated  https://medium.com/@ryanchenkie_40935/angular-authentication-using-route-guards-bf7a4ca13ae3 */
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        this.isAuth = this.authService.getAuthUserIsAuthenticated()
        if (this.isAuth) {
            return true
        }
        this.router.navigate(['/login'])
    }

}