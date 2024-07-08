import { NgModule } from "@angular/core";
import { AuthGuard } from "app/shared/auth/auth-guard.service";
import { Routes, RouterModule } from "@angular/router";
import { ErrorPageComponent } from "./error/error-page.component";
import { LoginPageComponent } from "./login/login-page.component";
import { ConfirmPasswordComponent } from "./confirm-password/confirm-password.component";
import { ResetPasswordComponent } from "./reset-password/reset-password.component";
import { BusinessRegisterComponent } from "./business_register/business_register.component";
import { AccountVerificationComponent } from "./account_verification/account_verification.component";
import { LocationImpactPdfComponent } from "app/index/location-impact/location-impact-pdf/location-impact-pdf.component";
import { SingleAssetPdfResolver } from "app/index/location-impact/location-impact-pdf/resolvers/single-asset.resolver";
import { LocationExplorerPdfResolver } from "app/index/location-impact/location-impact-pdf/resolvers/location-explorer.resolver";
import { TwoStepsConfigurationComponent } from "./two-steps-configuration/two-steps-configuration.component";

const routes: Routes = [
  {
    path: "",
    children: [
      {
        path: "error",
        component: ErrorPageComponent,
        data: {
          title: "Error Page",
        },
      },
      {
        path: "trial_setup",
        component: BusinessRegisterComponent,
        data: {
          title: "Register Page",
        },
      },
      {
        path: "account_verification",
        component: AccountVerificationComponent,
        data: {
          title: "Account Verification",
        },
      },
      {
        path: "login",
        component: LoginPageComponent,
        data: {
          title: "Login Page",
        },
      },
      {
        path: "login/mfa",
        component: TwoStepsConfigurationComponent,
      },
      {
        path: "confirm-password",
        component: ConfirmPasswordComponent,
        data: {
          title: "Confirm Password Page",
        },
      },
      {
        path: "reset-password",
        component: ResetPasswordComponent,
      },
      {//Do we need this?
        path: "location-impact-pdf/:propertyId/:scenario",
        component: LocationImpactPdfComponent,
        resolve: { resolvedData: SingleAssetPdfResolver }
      },
      {
        path: "location-impact-pdf",
        component: LocationImpactPdfComponent,
        resolve: { resolvedData: LocationExplorerPdfResolver }
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ContentPagesRoutingModule { }
