import { Router } from "@angular/router";
import { Injectable } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { DexieService } from "./dexie.service";
import { ApiService } from "./api.service";
import { Role } from "../data/roles";

@Injectable()
export class AuthService {
  admin: any = {};

  constructor(private router: Router, private toastr: ToastrService, private _dexieService: DexieService) {
    try {
      this.admin = JSON.parse(localStorage.getItem("admin"));
    } catch (e) {
      this.admin = {};
    }
  }

  setAdmin(admin) {
    this.admin = admin;
    localStorage.setItem("admin", JSON.stringify(this.admin));
  }

  isSessionValid(response) {
    if (response.status === 401) {
      this.logout();
      return false;
    } else {
      return true;
    }
  }

  logout(errorMessage = undefined) {
    this.admin = null;
    localStorage.clear();
    this._dexieService.deleteDataBase()
    if (this.router) this.router.navigate(["/login"]);
    errorMessage ? this.toastr.error(errorMessage) : "";
    return true;
  }

  getToken() {
    return this.admin && this.admin.token ? this.admin.token : "";
  }

  isAuthenticated() {
    return this.admin && this.admin.token;
  }

  isStaffUser() {
    return this.admin && this.admin.is_staff;
  }

  getUserId() {
    return this.admin.id;
  }

  getUserRoles() {
    return this.admin.roles;
  }

  isApproved() {
    return this.admin?.is_approved;
  }

  getUserInfo() {
    return {
      id: this.admin.id,
      is_staff: this.admin.is_staff
    }
  }

  isPublicLink() {
    if (localStorage.getItem("public-token")) {
      return true
    } else {
      return false
    }
  }

  isLocationExplorerTrialUser() { return this.admin?.roles.includes(Role.ROLES.LOCATION_EXPLORER_TRIAL) }

  isPortfolioAnalyticsTrialUser() { return this.admin?.roles.includes(Role.ROLES.PORTFOLIO_ANALYTICS_TRIAL) }

  isTrialUser() { return this.isLocationExplorerTrialUser() || this.isPortfolioAnalyticsTrialUser() }

  navigateToDashBoard() {
    if (!this.admin) return;
    this.router.navigate([Role.INVALID_REDIRECT_ROLE_PATH[Role.maximumAccess(this.admin.roles)]])
  }


}
