import { Routes } from "@angular/router";
import { Role } from "../data/roles";
//Route for content layout without sidebar, navbar and footer for pages like Login, Registration etc...
const roles = Role.ROLES
export const CONTENT_ROUTES: Routes = [
  {
    path: "",
    loadChildren: () =>
      import("../../pages/content-pages/content-pages.module").then(
        (m) => m.ContentPagesModule
      ),
  },
  {
    path: "customer-support",
    loadChildren: () =>
      import("../../customer-support/customer-support.module").then(
        (m) => m.CustomerSupportModule
      ),
  },
];
