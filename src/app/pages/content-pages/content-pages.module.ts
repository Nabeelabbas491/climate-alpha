import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { ContentPagesRoutingModule } from "./content-pages-routing.module";
import { ErrorPageComponent } from "./error/error-page.component";
import { ForgotPasswordPageComponent } from "./forgot-password/forgot-password-page.component";
import { LoginPageComponent } from "./login/login-page.component";
import { ConfirmPasswordComponent } from "./confirm-password/confirm-password.component";
import { NgxSpinnerModule } from 'ngx-spinner';
import { SharedModule } from "app/shared/shared.module";
import { NgCircleProgressModule } from 'ng-circle-progress';
import { UploadDataService } from "../../shared/services/upload-data.service";
import { AlphaFinderModule } from "app/alpha-finder/alpha-finder.module";
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { RegistrationTermsComponent } from './registration-terms/registration-terms.component';
import { NgSelectModule } from "@ng-select/ng-select";
import { BusinessRegisterComponent } from "./business_register/business_register.component";
import { AccountVerificationComponent } from "./account_verification/account_verification.component";
import { NgxOtpInputModule } from 'ngx-otp-input';
import { TwoStepsConfigurationComponent } from './two-steps-configuration/two-steps-configuration.component';
import { QRCodeModule } from "angularx-qrcode";
import { PasswordInfoPointsComponent } from './password-info-points/password-info-points.component';

@NgModule({
  imports: [
    CommonModule,
    NgbModule,
    ContentPagesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    SharedModule,
    AlphaFinderModule,
    NgSelectModule,
    NgxOtpInputModule,
    QRCodeModule,
    NgCircleProgressModule.forRoot({
      "maxPercent": 100,
      "responsive": true,
    })
  ],
  declarations: [
    ErrorPageComponent,
    ForgotPasswordPageComponent,
    LoginPageComponent,
    ConfirmPasswordComponent,
    BusinessRegisterComponent,
    AccountVerificationComponent,
    ResetPasswordComponent,
    RegistrationTermsComponent,
    TwoStepsConfigurationComponent,
    PasswordInfoPointsComponent,
  ],
  entryComponents: [],
  exports: [
    NgxSpinnerModule,
  ],
  providers: [UploadDataService],

})
export class ContentPagesModule { }
