
import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from "ngx-toastr";
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from "app/shared/services/api.service";
import { NgxOtpInputComponent, NgxOtpInputConfig } from 'ngx-otp-input';
import { AuthService } from 'app/shared/services/auth.service';

@Component({
  selector: 'app-account-verification',
  templateUrl: './account_verification.component.html',
  styleUrls: ['./account_verification.component.scss']
})
export class AccountVerificationComponent implements OnInit {
  @ViewChild('ngxotp', { static: false }) ngxOtp: NgxOtpInputComponent;
  show_resend_code = false
  maxTime: number = 60;
  time: number = this.maxTime; // global variable for string interpolation on html
  otpInputConfig: NgxOtpInputConfig = {
    otpLength: 6,
    autofocus: true,
    autoblur: true,
    numericInputMode: true,
  };
  renderPage: boolean = false;

  constructor(
    private router: Router,
    private api: ApiService,
    public route: ActivatedRoute,
    private toastr: ToastrService,
    private auth: AuthService,
  ) { }

  ngOnInit() {
    // If account is already verified, redirect to CP main page.
    if (this.auth.isApproved()) {
      this.auth.navigateToDashBoard()
    }
    else if (this.auth.admin) {
      this.renderPage = true;
      this.route.queryParams.subscribe(async (res: any) => {
        // secured query param to be accepted from login page only.
        if (Object.keys(res).length > 0 && res['_seQcs'] == 's') {
          return this.resendCode()
        }
      });
      this.getCurrentDate();
    } else {
      // If user is not saved, redirect to login.
      this.router.navigate(['login']);
    }
  }
  // this called every time when user changed the code
  onCodeChanged(code: string) { }

  verifyAccount(code) {
    var url = 'auth/verify_code/';
    return new Promise((resolve, reject) => {
      this.api.post(url, { code: code, user_id: this.auth.admin.id }).subscribe(
        (response) => {
          resolve(response)
        },
        (error) => {
          resolve(error.error)
        }
      );
    });
  }

  renewVerificationCode() {
    var url = 'auth/renew_code/';
    return new Promise((resolve, reject) => {
      this.api.post(url, { user_id: this.auth.admin.id }).subscribe(
        (response) => {
          resolve(response)
        },
        (error) => {
          resolve(error.error)
        }
      );
    });
  }

  // this called only if user entered full code
  async onCodeCompleted(code: string) {
    // verify code via API
    let response: any = await this.verifyAccount(code);
    if (response['success']) {
      this.auth.setAdmin(response.payload.user);
      this.toastr.success(
        response.payload.message,
        "Your account has been verified successfully",
        { timeOut: 4000 }
      );
      // this.closeModal()
      this.auth.navigateToDashBoard()
    } else {
      this.ngxOtp.clear();
      this.toastr.warning(
        response.message,
        "Invalid Verification code",
        { timeOut: 8000 }
      );
    }
  }
  getCurrentDate() {
    this.time = this.maxTime;
    this.show_resend_code = false
    let timer = setInterval(() => {
      this.time = this.time - 1;
      if (this.time == 0) {
        this.show_resend_code = true
        clearInterval(timer);
      }
    }, 1000);
  }

  async resendCode() {
    // Request new token from BE - renew_code
    let response: any = await this.renewVerificationCode();
    if (response['success']) {
      this.toastr.success(
        '',
        response.message,
        { timeOut: 8000 }
      );
      this.getCurrentDate();
    }
  }

}
