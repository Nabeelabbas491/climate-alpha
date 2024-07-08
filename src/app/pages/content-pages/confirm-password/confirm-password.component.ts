import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ApiService } from "app/shared/services/api.service";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-confirm-password",
  styleUrls: ["./confirm-password.component.scss"],
  templateUrl: "./confirm-password.component.html",
})
export class ConfirmPasswordComponent {
  token: string;
  id: string;
  password: string = "";
  repeatPassword: string;
  verified: boolean = false;
  passwordError = [];
  loading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private toastr: ToastrService,
    private router: Router
  ) {
    this.token = this.route.snapshot.queryParams["ctd"];
    this.id = this.route.snapshot.queryParams["lds"];
    this.verifyUser();
  }
  verifyUser(set_password: any = undefined) {
    this.api
      .post("auth/password_reset_confirm/", {
        uidb64: this.id,
        token: this.token,
        password: this.password,
        set_password,
      })
      .subscribe(
        (response) => {
          this.loading = false;
          this.verified = true;
          let resp = response;
          if (this.password) {
            this.toastr.success("Password reset successfully", "", {
              timeOut: 5000,
            });
            this.router.navigate(["login"]);
          }
        },
        (error) => {
          this.loading = false;
          let resp = error.error;
          this.toastr.error(
            resp.payload.errors.map((a) => a),
            "Error"
          );
        }
      );
  }
}
