import { Component, NgModule } from "@angular/core";
import { RouterModule, Routes, PreloadAllModules } from "@angular/router";

import { FullLayoutComponent } from "./layouts/full/full-layout.component";
import { ContentLayoutComponent } from "./layouts/content/content-layout.component";

import { Full_ROUTES } from "./shared/routes/full-layout.routes";
import { CONTENT_ROUTES } from "./shared/routes/content-layout.routes";

import { AuthGuard } from "./shared/auth/auth-guard.service";
import { ErrorPageComponent } from "./pages/content-pages/error/error-page.component";


// import { LoginPageComponent } from "./pages/content-pages/login/login-page.component";

const appRoutes: Routes = [
  {
    path: "",
    redirectTo: "login",
    pathMatch: "full",

  },
  {
    path: "",
    component: FullLayoutComponent,
    // data: { title: "full Views" },
    children: Full_ROUTES,
    canActivate: [AuthGuard],
    // runGuardsAndResolvers: "always",    // it will always run the auth guard 
  },
  {
    path: "",
    component: ContentLayoutComponent,
    data: { title: "content Views" },
    children: CONTENT_ROUTES,
  },
  {
    path: 'link-expired',
    data: { message: 'This link has expired.', description: 'Please contact the sender or customer support for further assistance.' },
    component: ErrorPageComponent
  },
  {
    path: "**",
    component: ErrorPageComponent,
  },

];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
