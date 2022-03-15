import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot,
  CanActivate,
  CanLoad,
  Route,
  RouterStateSnapshot,
  UrlSegment,
  UrlTree
} from '@angular/router';
import {Observable} from 'rxjs';
import {UserService} from "../user.service";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanLoad, CanActivate {
  constructor(private user: UserService) {
  }

  canLoad(route: Route, segments: UrlSegment[]): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    return this.checkPermissions(route)
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
      return this.checkPermissions(route)
    }


  checkPermissions(route: ActivatedRouteSnapshot | Route){
    if (!route.data ||
      route.data['roles'] === null ||
      !Array.isArray(route.data['roles']) ||
      route.data['allowBanned'] === null ||
      route.data['allowLoggedIn'] === null ||
      route.data['requireLogin'] === null)
      return false

    const roles = route.data['roles']
    const allowBanned = route.data['allowBanned']
    const allowLoggedIn = route.data['allowLoggedIn']
    const requireLogin = route.data['requireLogin']

    // console.log(roles)

    if (this.user.isBanned() && !allowBanned)
      return false

    if (this.user.isLoggedIn() && !allowLoggedIn)
      return false

    if (!this.user.isLoggedIn() && requireLogin)
      return false

    if (!requireLogin)
      return true

    if (!this.user.currentUser)
      return false

    for (let role of this.user.currentUser.rolesIDs){
      if (roles.includes(role))
        return true
    }

    return false
  }
}
