import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Role } from '../data/roles';
@Injectable({
  providedIn: 'root'
})
export class RolesGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) { }

  previousUrl: string = null;
  currentUrl: string = null;
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    let user_roles = this.authService.admin?.roles || [Role.ROLES.SHAREABLE_LINK];
    let route_attached_roles = route.data.roles || route.routeConfig.data.roles
    if (Role.hasAccess(user_roles, route_attached_roles)) {
      return true;
    } else {
      // history.back()
      let role = Role.maximumAccess(user_roles);
      if (role == 0) this.router.navigate(['/login']);
      this.router.navigate([Role.INVALID_REDIRECT_ROLE_PATH[role]])
      return false
    }
  }

}
