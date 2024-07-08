import { Component, EventEmitter, Output, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { ApiService } from "app/shared/services/api.service";

import { AppConstants } from "app/shared/data/constants";


@Component({
  selector: "app-forgot-password-page",
  templateUrl: "./forgot-password-page.component.html",
  styleUrls: ["./forgot-password-page.component.scss"],
})
export class ForgotPasswordPageComponent {
  @ViewChild("f", { static: false }) recoverPasswordForm: NgForm;
  email: string;
  showFields: boolean = false;
  formSubmittedOnce = false;
  loading: boolean = false;
  closeResult: string;
  showRegistration: Boolean = false;
  @Output() forgot_password = new EventEmitter();

  emailValidator = AppConstants.EMAIL_PATTERN;
  incorrect_email_Error = AppConstants.INCORRECT_EMAIL_ADDRESS;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private api: ApiService
  ) { }

  // On submit click, reset form fields
  onSubmit() {
    if (!this.email) {
      return this.toastr.error("No email provided to recover password");
    }
    if (this.recoverPasswordForm.controls.inputEmail.invalid) {
      return this.toastr.error("Invalid Email", "Error");
    }
    this.api
      .post("auth/password_reset/", {
        email: this.email,
      })
      .subscribe(
        (response) => {
          this.loading = false;
          this.toastr.success(
            "An email has been sent to you with password reset instructions",
            "",
            { timeOut: 5000 }
          );
          this.router.navigate(["login"]);
        },
        (error) => {
          this.loading = false;
          let error_message = error.error.message;
          this.toastr.error(error_message, "Error");
        }
      );
  }

  // On login link click
  onLogin() {
    this.router.navigate(["login"], { relativeTo: this.route.parent });
  }

  // On registration link click
  onRegister() {
    this.router.navigate(["register"], { relativeTo: this.route.parent });
  }

  // onBackToLoginScreen(){
  //   this.forgot
  // }


}
