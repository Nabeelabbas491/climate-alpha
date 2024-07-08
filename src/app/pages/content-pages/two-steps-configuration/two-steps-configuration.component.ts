import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Role } from 'app/shared/data/roles';
import { ApiService } from 'app/shared/services/api.service';
import { AuthService } from 'app/shared/services/auth.service';
import { NgxOtpInputComponent, NgxOtpInputConfig } from 'ngx-otp-input';
import { ToastrService } from 'ngx-toastr';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-two-steps-configuration',
  templateUrl: './two-steps-configuration.component.html',
  styleUrls: ['../login/login-page.component.scss', './two-steps-configuration.component.scss']
})
export class TwoStepsConfigurationComponent implements OnInit, OnDestroy {

  otpInputConfig: NgxOtpInputConfig = {
    otpLength: 6,
    autofocus: true,
    autoblur: true,
    numericInputMode: true,
  };
  user;
  setupMFA: string = 'setup-messege'
  qrCode: string;
  isEmailOTPexpired;
  configureAnotherSetup: boolean = false
  otp;

  public minutes: number;
  public seconds: number;

  private subscription: Subscription;

  private readonly TIMER_DURATION = 5 * 60; // 5 minutes in seconds
  private remainingTime: number;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private auth: AuthService,
    private cdr: ChangeDetectorRef,
    private apiService: ApiService,
    private toastr: ToastrService) {

    this.user = this.auth.admin

    // this.user.totp_mfa_enabled = true
    // this.user.email_mfa_enabled = true

    this.configureAnotherSetup = this.user.totp_mfa_enabled && this.user.email_mfa_enabled

  }

  ngOnInit(): void {
    if (this.user.totp_mfa_enabled || this.user.email_mfa_enabled) this.showMFApage()
  }

  showMFApage() {
    this.setupMFA = 'setup-selection'
    this.cdr.detectChanges()
    if (this.configureAnotherSetup) {
      document.getElementById('mfa-totp').style.display = this.user.email_mfa_enabled ? 'flex' : 'none'
      document.getElementById('mfa-email').style.display = this.user.totp_mfa_enabled ? 'flex' : 'none'
    } else {
      document.getElementById('mfa-totp').style.display = this.user.totp_mfa_enabled ? 'flex' : 'none'
      document.getElementById('mfa-email').style.display = this.user.email_mfa_enabled ? 'flex' : 'none'
    }
  }

  authorizeUserAccess() {
    localStorage.getItem('public-token') && localStorage.removeItem('public-token')
    this.auth.navigateToDashBoard()
    this.toastr.success('You are logged in!', "You've logged in successfully", { timeOut: 1000 });
  }

  async getGoogleAuthenticatorOTP() {
    try {
      let response = await this.apiService.get(`auth/mfa/totp/setup?user_id=${this.user.id}`).toPromise()
      this.configureAnotherSetup = false
      this.setupMFA = 'setup-authenticator-app'
      this.qrCode = response.payload.uri
    } catch (e) { }
  }

  async getGmailAuthenticationLink() {
    try {
      await this.apiService.get(`auth/mfa/email/setup?user_id=${this.user.id}`).toPromise()
      this.configureAnotherSetup = false
      this.setupMFA = 'setup-email'
      this.isEmailOTPexpired = false
      this.startTimer()
    } catch (e) { }
  }

  async verifyOTP() {
    try {
      switch (this.setupMFA) {
        case 'setup-authenticator-app':
          var response = await this.apiService.post('auth/mfa/totp/verify/', { otp: this.otp, user_id: this.user.id }).toPromise()
          break;
        case 'setup-email':
          var response = await this.apiService.post('auth/mfa/email/verify/', { otp: this.otp, user_id: this.user.id }).toPromise()
          break;
      }
      this.auth.setAdmin(response.payload.user);
      this.authorizeUserAccess()
    } catch (e) {
      this.toastr.error('OTP is incorrect. Please try again.')
    }
  }

  onCodeChanged(event) { }

  onCodeCompleted = (event) => this.otp = event

  startTimer(): void {
    this.remainingTime = this.TIMER_DURATION;
    this.updateTimeDisplay();

    const timer$ = interval(1000);
    this.subscription = timer$.subscribe(() => {
      this.remainingTime--;

      if (this.remainingTime < 0) {
        this.subscription.unsubscribe();
      } else {
        this.updateTimeDisplay();
      }
    });
  }

  updateTimeDisplay(): void {
    this.minutes = Math.floor(this.remainingTime / 60);
    this.seconds = this.remainingTime % 60;
    if (this.minutes == 0 && this.seconds == 0) this.isEmailOTPexpired = true
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe()
  }

}
