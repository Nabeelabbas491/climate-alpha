
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ApiService } from "app/shared/services/api.service";
import { ToastrService } from "ngx-toastr";

import { MustMatch } from '../../../shared/directives/must-match.validator';
import { Router } from '@angular/router';
import { AuthService } from "app/shared/services/auth.service";
import { RegistrationTermsComponent } from '../registration-terms/registration-terms.component';
import { AccountVerificationComponent } from '../account_verification/account_verification.component';
import { Role } from 'app/shared/data/roles';

@Component({
  selector: 'app-business-register',
  templateUrl: './business_register.component.html',
  styleUrls: ['./business_register.component.scss']
})
export class BusinessRegisterComponent implements OnInit {
  // @ViewChild(AccountVerificationComponent) accountVerificationComponent: AccountVerificationComponent
  @ViewChild(RegistrationTermsComponent, { static: false }) terms_component: RegistrationTermsComponent
  registerFormSubmitted = false;
  registerForm: FormGroup;
  showPassword = false
  showConfirmPassword = false
  isRegisterForm = true


  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private auth: AuthService,
    private api: ApiService,) { }

  ngOnInit() {

    if (!this.auth.isAuthenticated()) {
      this.registerForm = this.formBuilder.group({
        first_name: ['', Validators.required],
        last_name: ['', Validators.required],
        company: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(12)]],
        confirmPassword: ['', Validators.required],
        isConditionsSelected: false,
      }, {
        validator: MustMatch('password', 'confirmPassword')
      });
    } else {
      this.redirectUser()
    }
  }


  get rf() {
    return this.registerForm.controls;
  }

  redirectUser() {
    this.router.navigate(['/login'])
  }

  next() {
    if (this.registerForm.invalid) {
      return;
    } else {
      this.isRegisterForm = false
    }
  }

  openTermsModal() {
    this.terms_component.openModal(this.terms_component.modalRef)
  }

  get isConditionsSelected() { return this.registerForm.get('isConditionsSelected').value; }

  onSubmit() {
    this.registerFormSubmitted = true;
    let formData = { ...this.registerForm.value }
    this.api
      .post("auth/cp_trial/", formData)
      .subscribe(
        (response) => {
          if (response.success) {
            this.auth.setAdmin(response.payload.user);
            if (this.auth.isApproved()) {
              this.toastr.success(
                response.payload.message,
                "You're registered successfully",
                { timeOut: 1000 }
              );
              this.redirectUser()
            }
            else {
              this.toastr.success(
                response.payload.message,
                "You're registered successfully. In order to activate your account, please verify the code sent to your registered email",
                { timeOut: 8000 }
              );
              this.router.navigate(['account_verification/'])
            }
          }
          else {
            this.toastr.error(response.payload.message, "Error");
          }
        },
        (error) => {
          let errors = error.error.payload;
          for (var key of Object.keys(errors)) {
            this.toastr.error(errors[key], "Error");
          }
        }
      );
  }

}