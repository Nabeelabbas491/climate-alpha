import { Component, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { AuthService } from "app/shared/services/auth.service";
import { ApiService } from "app/shared/services/api.service";
import { environment } from "environments/environment";
import { Role } from "app/shared/data/roles";
import { DexieService } from "app/shared/services/dexie.service";


@Component({
  selector: "app-login-page",
  templateUrl: "./login-page.component.html",
  styleUrls: ["./login-page.component.scss"],
})
export class LoginPageComponent {
  @ViewChild("f") loginForm: NgForm;

  loading: boolean = false;
  formSubmittedOnce = false;
  email: string;
  password: string;
  reset: boolean;
  showPassword = false
  isLoginScreen = true

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private api: ApiService,
    private auth: AuthService,
    private toastr: ToastrService,
    private _dexieService: DexieService
  ) {
    if (this.auth.isAuthenticated()) {
      let role = Role.maximumAccess(this.auth.admin.roles);
      this.router.navigate([Role.INVALID_REDIRECT_ROLE_PATH[role]])
    } else {
      localStorage.clear()
      this._dexieService.deleteDataBase()
    }
  }

  // On submit button click
  onSubmit() {
    this.formSubmittedOnce = true;
    if (!this.email || !this.password) {
      if (!this.email) {
        return this.toastr.error("Email is required", "Error");
      }
      return this.toastr.error("Password is required", "Error");
    }

    this.loading = true;
    this.api
      .post("auth/login/", {
        email: this.email,
        password: this.password,
      })
      .subscribe(
        (response) => {

          let resp = response;
          this.loading = false;
          this.auth.setAdmin(resp.payload.user);
          const returnUrl = this.route.snapshot.queryParams['returnUrl']
          if (returnUrl) {
            this.router.navigate(['login/mfa'], { queryParams: { returnUrl: returnUrl } });
          } else {
            this.router.navigate(['login/mfa'])

          }
        },
        (error) => {
          this.loading = false;
          if (error.status == 422 && error.error.payload.user) {
            // Account is inactive, redirect to verification page with special param to request new code.
            this.auth.setAdmin(error.error.payload.user);
            this.router.navigate(['account_verification'], { queryParams: { _seQcs: 's' } });

          } else {
            let error_message = error.error.message;
            this.toastr.error(error_message, "Error");
          }
        }
      );
  }

  // On Forgot password link click
  onForgotPassword() {
    this.router.navigate(["forgot-password"], {
      relativeTo: this.route.parent,
    });
  }
  // On registration link click
  onRegister() {
    this.router.navigate(["register"], { relativeTo: this.route.parent });
  }

  backtologin(data) { }
}
